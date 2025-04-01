import { TeamMember } from '../components/MemberForm';

// Type for team member coming from the API
export interface ApiTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Convert API team member to UI team member format
export const apiToUiTeamMember = (apiMember: ApiTeamMember): TeamMember => ({
  id: apiMember.id,
  name: apiMember.name,
  email: apiMember.email,
  role: apiMember.role || 'Member', // Ensure role is always set, default to Member
  avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`, // Generate random avatar if none is provided
});

// Convert UI team member to API format for creating/updating
export const uiToApiTeamMember = (uiMember: TeamMember) => ({
  name: uiMember.name,
  email: uiMember.email,
  role: uiMember.role, // Use the role directly
});

// Fetch all team members
export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const response = await fetch('/api/team');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch team members');
    }
    
    const apiMembers: ApiTeamMember[] = await response.json();
    return apiMembers.map(apiToUiTeamMember);
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

// Fetch a single team member
export const fetchTeamMember = async (id: string): Promise<TeamMember> => {
  try {
    const response = await fetch(`/api/team/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch team member');
    }
    
    const apiMember: ApiTeamMember = await response.json();
    return apiToUiTeamMember(apiMember);
  } catch (error) {
    console.error(`Error fetching team member with ID ${id}:`, error);
    throw error;
  }
};

// Create a new team member
export const createTeamMember = async (member: TeamMember & { password?: string }): Promise<TeamMember> => {
  try {
    const apiMember = {
      ...uiToApiTeamMember(member),
      password: member.password,
    };
    
    const response = await fetch('/api/team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiMember),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create team member');
    }
    
    const newApiMember: ApiTeamMember = await response.json();
    return apiToUiTeamMember(newApiMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    throw error;
  }
};

// Update a team member
export const updateTeamMember = async (id: string, member: Partial<TeamMember> & { password?: string }): Promise<TeamMember> => {
  try {
    const updateData: any = {};
    
    if (member.name) updateData.name = member.name;
    if (member.email) updateData.email = member.email;
    if (member.role) updateData.role = member.role;
    if (member.password) updateData.password = member.password;
    
    const response = await fetch(`/api/team/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update team member');
    }
    
    const updatedApiMember: ApiTeamMember = await response.json();
    return apiToUiTeamMember(updatedApiMember);
  } catch (error) {
    console.error(`Error updating team member with ID ${id}:`, error);
    throw error;
  }
};

// Delete a team member
export const deleteTeamMember = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/team/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete team member');
    }
  } catch (error) {
    console.error(`Error deleting team member with ID ${id}:`, error);
    throw error;
  }
}; 