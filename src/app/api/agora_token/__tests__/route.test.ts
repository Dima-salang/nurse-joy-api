/**
 * @jest-environment node
 */
import { POST } from '../route';
import { NextRequest } from 'next/server';
import { RtcTokenBuilder } from 'agora-token';
import { firestore } from '@/utils/firebase.emulator';
import { doc, setDoc, collection, getDoc } from 'firebase/firestore/lite';

// Mock the agora-token module
jest.mock('agora-token', () => ({
  RtcTokenBuilder: {
    buildTokenWithUid: jest.fn().mockReturnValue('mock-token'),
  },
  RtcRole: {
    PUBLISHER: 1,
  },
}));

// Mock environment variables
process.env.AGORA_APP_ID = 'test-app-id';
process.env.AGORA_APP_CERTIFICATE = 'test-app-certificate';

describe('Agora Token API', () => {
  beforeEach(async () => {
    // Clear the Firestore emulator before each test
    const videoCallRef = collection(firestore, 'video-call');
    const snapshot = await getDoc(doc(videoCallRef, 'test-channel'));
    if (snapshot.exists()) {
      await setDoc(doc(videoCallRef, 'test-channel'), {});
    }
  });

  it('should return 400 if channelName or uid is missing', async () => {
    const req = {
      json: () => Promise.resolve({ chatRoomId: '123' }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Channel name and uid are required');
  });

  it('should generate and return token with valid data', async () => {
    const mockData = {
      chatRoomId: '123',
      channelName: 'test-channel',
      uid: 12345,
    };

    const req = {
      json: () => Promise.resolve(mockData),
    } as unknown as NextRequest;

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.token).toBe('mock-token');
    expect(RtcTokenBuilder.buildTokenWithUid).toHaveBeenCalledWith(
      'test-app-id',
      'test-app-certificate',
      mockData.channelName,
      mockData.uid,
      1, // RtcRole.PUBLISHER
      expect.any(Number), // expirationTime
      expect.any(Number), // privilegeExpiredTs
    );
  });

  it('should store token in Firestore', async () => {
    const mockData = {
      chatRoomId: '123',
      channelName: 'test-channel',
      uid: 12345,
    };

    const req = {
      json: () => Promise.resolve(mockData),
    } as unknown as NextRequest;

    await POST(req);

    // Verify the data was stored in Firestore
    const videoCallRef = collection(firestore, 'video-call');
    const docRef = doc(videoCallRef, mockData.channelName);
    const snapshot = await getDoc(docRef);
    
    expect(snapshot.exists()).toBe(true);
    const data = snapshot.data();
    expect(data).toMatchObject({
      chatRoomId: mockData.chatRoomId,
      channelName: mockData.channelName,
      uid: mockData.uid,
      token: 'mock-token',
      expiresAt: expect.any(Number),
      createdAt: expect.objectContaining({
        seconds: expect.any(Number),
        nanoseconds: expect.any(Number),
      }),
    });
  });
}); 