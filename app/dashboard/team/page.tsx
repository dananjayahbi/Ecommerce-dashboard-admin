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

  const handleEdit = (id: string) => {
    const memberToEdit = teamMembers.find(member => member.id === id);
    if (memberToEdit) {
      setCurrentMember(memberToEdit);
      setEditModalVisible(true);
    }
  };

  const showDeleteModal = (id: string) => {
    setMemberToDelete(id);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (memberToDelete) {
      try {
        setIsLoading(true);
        await deleteTeamMember(memberToDelete);
        setTeamMembers(prev => prev.filter(member => member.id !== memberToDelete));
        message.success('Team member deleted successfully');
      } catch (err: any) {
        console.error('Error deleting team member:', err);
        message.error(err.message || 'Failed to delete team member');
      } finally {
        setIsLoading(false);
        setDeleteModalVisible(false);
      }
    }
  };

  const handleAddMember = () => {
    setAddModalVisible(true);
  };

  const handleAddSubmit = async (values: TeamMember & { password?: string }) => {
    if (!values.password) {
      message.error('Password is required when adding a new team member');
      return;
    }
    
    try {
      setIsLoading(true);
      const newMember = await createTeamMember({
        ...values,
        password: values.password
      });
      
      setTeamMembers(prev => [...prev, newMember]);
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

  return (
    <div className="bg-white p-6 rounded shadow-sm">
      <Flex justify="space-between" align="center" className="mb-6">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <Button 
          type="primary" 
          icon={<UserAddOutlined />} 
          onClick={handleAddMember}
          className="bg-blue-600"
        >
          Add New Member
        </Button>
      </Flex>
      
      {teamMembers.length === 0 ? (
        <Empty 
          description="No team members found" 
          className="my-12"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {teamMembers.map(member => (
            <Card 
              key={member.id}
              hoverable
              className="w-full"
              cover={
                <div className="flex justify-center p-4 bg-gray-50">
                  <img
                    alt={member.name}
                    src={member.avatar || `https://randomuser.me/api/portraits/men/1.jpg`}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
              }
              actions={[
                <Tooltip key="edit" title="Edit">
                  <EditOutlined onClick={() => handleEdit(member.id!.toString())} />
                </Tooltip>,
                <Tooltip key="delete" title="Delete">
                  <DeleteOutlined onClick={() => showDeleteModal(member.id!.toString())} className="text-red-500" />
                </Tooltip>
              ]}
            >
              <Card.Meta
                title={member.name}
                description={
                  <div>
                    <p className="text-sm font-medium text-gray-700">{member.role}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                }
              />
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