// API Mock Layer with TypeScript Interfaces
// This file defines all data structures and mock API functions

import { StaffMember, Job } from '../types';

// ============================================================
// CHAT & NOTIFICATIONS INTERFACES
// ============================================================

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'business' | 'staff' | 'agency' | 'sales';
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  type: 'job_posted' | 'candidate_assigned' | 'interview_scheduled' | 'hire_confirmed' | 'chat_message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// ============================================================
// MATCHING ALGORITHM INTERFACES
// ============================================================

export interface MatchScore {
  candidateId: string;
  jobId: string;
  totalScore: number;
  skillMatch: number;
  locationProximity: number;
  experienceMatch: number;
  breakdown: {
    skillScore: number;
    locationScore: number;
    experienceScore: number;
  };
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address: string;
}

// ============================================================
// MAP INTERFACES
// ============================================================

export interface MapMarker {
  id: string;
  position: LocationCoordinates;
  type: 'job' | 'candidate' | 'business';
  title: string;
  description?: string;
}

// ============================================================
// MOCK API FUNCTIONS
// ============================================================

/**
 * Calculate match score between a candidate and a job
 * @param candidate - The staff member to match
 * @param job - The job to match against
 * @returns MatchScore object with detailed breakdown
 */
export const calculateMatchScore = (candidate: StaffMember, job: Job): MatchScore => {
  let skillScore = 0;
  let locationScore = 0;
  let experienceScore = 0;

  // Skill Match (40% weight)
  if (candidate.skill.toLowerCase() === job.role.toLowerCase()) {
    skillScore = 100;
  } else if (candidate.skill.toLowerCase().includes(job.role.toLowerCase()) || 
             job.role.toLowerCase().includes(candidate.skill.toLowerCase())) {
    skillScore = 70;
  } else {
    skillScore = 30;
  }

  // Location Proximity (30% weight) - Simplified
  const candidateLocation = candidate.currentLocation?.toLowerCase() || '';
  const jobLocation = job.location.toLowerCase();
  
  if (candidateLocation.includes('looking for work')) {
    locationScore = 100; // Actively looking
  } else if (candidateLocation && jobLocation.includes(candidateLocation.split(',')[0])) {
    locationScore = 90; // Same city
  } else if (job.pinCode && candidateLocation.includes(job.pinCode)) {
    locationScore = 85; // Same pin code area
  } else {
    locationScore = 50; // Different location
  }

  // Experience Match (30% weight)
  const expYears = candidate.experienceYears || 0;
  if (expYears >= 5) {
    experienceScore = 100;
  } else if (expYears >= 3) {
    experienceScore = 85;
  } else if (expYears >= 1) {
    experienceScore = 70;
  } else {
    experienceScore = 50;
  }

  // Bonus for verified candidates
  const verificationBonus = candidate.isVerified ? 10 : 0;

  const totalScore = Math.min(
    100,
    (skillScore * 0.4 + locationScore * 0.3 + experienceScore * 0.3 + verificationBonus)
  );

  return {
    candidateId: candidate.id,
    jobId: job.id,
    totalScore: Math.round(totalScore),
    skillMatch: skillScore,
    locationProximity: locationScore,
    experienceMatch: experienceScore,
    breakdown: {
      skillScore,
      locationScore,
      experienceScore
    }
  };
};

/**
 * Get match color based on score
 */
export const getMatchColor = (score: number): string => {
  if (score >= 85) return 'emerald';
  if (score >= 70) return 'blue';
  if (score >= 50) return 'orange';
  return 'slate';
};

/**
 * Mock function to send a chat message
 */
export const sendChatMessage = async (message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...message,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString()
      });
    }, 500);
  });
};

/**
 * Mock function to fetch chat history
 */
export const fetchChatHistory = async (userId: string, otherUserId: string): Promise<ChatMessage[]> => {
  // Mock data - replace with real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          senderId: otherUserId,
          senderName: 'Agency Support',
          senderRole: 'agency',
          receiverId: userId,
          message: 'Hello! Your profile has been approved for trial.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: true
        }
      ]);
    }, 300);
  });
};

/**
 * Mock function to create a notification
 */
export const createNotification = (notification: Omit<Notification, 'id' | 'timestamp'>): Notification => {
  return {
    ...notification,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString()
  };
};

/**
 * Mock function to get coordinates from address
 */
export const geocodeAddress = async (address: string): Promise<LocationCoordinates> => {
  // Mock geocoding - in production, use Google Maps Geocoding API
  const mockCoordinates: Record<string, LocationCoordinates> = {
    'Mumbai': { lat: 19.0760, lng: 72.8777, address: 'Mumbai, Maharashtra' },
    'Delhi': { lat: 28.7041, lng: 77.1025, address: 'Delhi, India' },
    'Bangalore': { lat: 12.9716, lng: 77.5946, address: 'Bangalore, Karnataka' },
    'Pune': { lat: 18.5204, lng: 73.8567, address: 'Pune, Maharashtra' }
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      const city = Object.keys(mockCoordinates).find(key => 
        address.toLowerCase().includes(key.toLowerCase())
      );
      resolve(city ? mockCoordinates[city] : mockCoordinates['Mumbai']);
    }, 200);
  });
};

/**
 * Mock function to get nearby opportunities
 */
export const getNearbyOpportunities = async (
  location: LocationCoordinates, 
  radius: number = 10
): Promise<MapMarker[]> => {
  // Mock data - replace with real API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          position: { lat: location.lat + 0.01, lng: location.lng + 0.01, address: 'Nearby Restaurant' },
          type: 'job',
          title: 'Continental Chef Needed',
          description: '₹30,000/month'
        },
        {
          id: '2',
          position: { lat: location.lat - 0.01, lng: location.lng - 0.01, address: 'Downtown Cafe' },
          type: 'job',
          title: 'Waiter Position',
          description: '₹22,000/month'
        }
      ]);
    }, 500);
  });
};

// ============================================================
// MOCK DATA EXPORTS
// ============================================================

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'job_posted',
    title: 'New Job Posted',
    message: 'Continental Chef position available at Mamta Cafe',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: false
  },
  {
    id: '2',
    type: 'candidate_assigned',
    title: 'Candidate Assigned',
    message: 'Rajesh Kumar matched to your job posting',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false
  }
];
