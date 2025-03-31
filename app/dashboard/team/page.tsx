'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Flex, Tooltip, Modal, message, Spin, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import MemberForm, { TeamMember } from './components/MemberForm';
import { 
  fetchTeamMembers, 
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember 
} from './services/teamService';
import { useSession } from 'next-auth/react';

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'Member';

  // Load team members on component mount
  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setIsPageLoading(true);
      setError(null);
      const members = await fetchTeamMembers();
      setTeamMembers(members);
    } catch (err: any) {
      console.error('Failed to load team members:', err);
      setError(err.message || 'Failed to load team members');
      message.error('Failed to load team members');
    } finally {
      setIsPageLoading(false);
    }
  };

  const canEditMember = (member: TeamMember) => {
    // Super-Admin can edit anyone
    if (userRole === 'Super-Admin') return true;
    
    // Admin can only edit Members, not other Admins or Super-Admins
    if (userRole === 'Admin') {
      return member.role !== 'Admin' && member.role !== 'Super-Admin';
    }
    
    // Members can't edit anyone
    return false;
  };

  const canDeleteMember = (member: TeamMember) => {
    // The same logic as editing applies for deletion
    return canEditMember(member);
  };

  const handleEdit = (id: string) => {
    const memberToEdit = teamMembers.find(member => member.id === id);
    if (memberToEdit && canEditMember(memberToEdit)) {
      setCurrentMember(memberToEdit);
      setEditModalVisible(true);
    }
  };

  const showDeleteModal = (id: string) => {
    const memberToDelete = teamMembers.find(member => member.id === id);
    if (memberToDelete && canDeleteMember(memberToDelete)) {
      setMemberToDelete(id);
      setDeleteModalVisible(true);
    }
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;
    
    try {
      setIsLoading(true);
      await deleteTeamMember(memberToDelete);
      
      setTeamMembers(prev => 
        prev.filter(member => member.id !== memberToDelete)
      );
      
      message.success('Team member deleted successfully');
      setDeleteModalVisible(false);
      setMemberToDelete(null);
    } catch (err: any) {
      console.error('Error deleting team member:', err);
      message.error(err.message || 'Failed to delete team member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = () => {
    setAddModalVisible(true);
  };

  const handleAddSubmit = async (values: TeamMember & { password?: string }) => {
    try {
      setIsLoading(true);
      const newMember = await createTeamMember(values);
      
      setTeamMembers(prev => [newMember, ...prev]);
      
      message.success('Team member added successfully');
      setAddModalVisible(false);
    } catch (err: any) {
      console.error('Error adding team member:', err);
      message.error(err.message || 'Failed to add team member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (values: TeamMember & { password?: string }) => {
    if (!values.id) return;
    
    try {
      setIsLoading(true);
      const updatedMember = await updateTeamMember(
        values.id.toString(),
        values
      );
      
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === updatedMember.id ? updatedMember : member
        )
      );
      
      message.success('Team member updated successfully');
      setEditModalVisible(false);
    } catch (err: any) {
      console.error('Error updating team member:', err);
      message.error(err.message || 'Failed to update team member');
    } finally {
      setIsLoading(false);
    }
  };

  // If the page is loading, show a loading spinner
  if (isPageLoading) {
    return (
      <div className="bg-white p-6 rounded shadow-sm flex justify-center items-center h-64">
        <Spin size="large" tip="Loading team members..." />
      </div>
    );
  }

  // If there was an error loading the data, show an error message
  if (error) {
    return (
      <div className="bg-white p-6 rounded shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Team Management</h1>
        <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
          <p>{error}</p>
          <Button 
            type="primary" 
            onClick={loadTeamMembers} 
            className="mt-4 bg-blue-600"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Check if user can add new members (only Super-Admin and Admin)
  const canAddMembers = userRole === 'Super-Admin' || userRole === 'Admin';

  return (
    <div className="bg-white p-6 rounded shadow-sm">
      <Flex justify="space-between" align="center" className="mb-6">
        <h1 className="text-2xl font-bold">Team Management</h1>
        {canAddMembers && (
          <Button 
            type="primary" 
            icon={<UserAddOutlined />} 
            onClick={handleAddMember}
            className="bg-blue-600"
          >
            Add New Member
          </Button>
        )}
      </Flex>
      
      {teamMembers.length === 0 ? (
        <Empty 
          description="No team members found" 
          className="my-12"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map(member => (
            <Card 
              key={member.id}
              hoverable
              className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200"
              cover={
                <div className="relative flex justify-center p-6 bg-gradient-to-r from-blue-500 to-purple-600">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-80"></div>
                  <img
                    alt={member.name}
                    src={member.avatar || `https://randomuser.me/api/portraits/men/1.jpg`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md z-10"
                  />
                </div>
              }
              actions={
                [
                  // Show edit button only if user has permission
                  canEditMember(member) && (
                    <Tooltip key="edit" title="Edit Member">
                      <EditOutlined onClick={() => handleEdit(member.id!.toString())} />
                    </Tooltip>
                  ),
                  // Show delete button only if user has permission
                  canDeleteMember(member) && (
                    <Tooltip key="delete" title="Delete Member">
                      <DeleteOutlined onClick={() => showDeleteModal(member.id!.toString())} className="text-red-500" />
                    </Tooltip>
                  )
                ].filter(Boolean) // Filter out undefined/false values
              }
            >
              <div className="px-2 py-4 text-center">
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                
                <div className="mb-2">
                  {member.role === 'Super-Admin' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Super Admin
                    </span>
                  )}
                  {member.role === 'Admin' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Admin
                    </span>
                  )}
                  {member.role === 'Member' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Member
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {member.email}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: isLoading }}
        closable={!isLoading}
        maskClosable={!isLoading}
      >
        <p>Are you sure you want to delete this team member?</p>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        title="Add New Team Member"
        open={addModalVisible}
        onCancel={() => !isLoading && setAddModalVisible(false)}
        footer={null}
        width={500}
        closable={!isLoading}
        maskClosable={!isLoading}
      >
        <MemberForm
          onSubmit={handleAddSubmit}
          onCancel={() => !isLoading && setAddModalVisible(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        title="Edit Team Member"
        open={editModalVisible}
        onCancel={() => !isLoading && setEditModalVisible(false)}
        footer={null}
        width={500}
        closable={!isLoading}
        maskClosable={!isLoading}
      >
        <MemberForm
          initialValues={currentMember}
          onSubmit={handleEditSubmit}
          onCancel={() => !isLoading && setEditModalVisible(false)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
} 