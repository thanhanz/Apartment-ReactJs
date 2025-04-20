import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Card, 
  Avatar, 
  Button, 
  Modal, 
  Input, 
  Spin, 
  Typography, 
  Badge,
  Dropdown,
  Space
} from "antd";
import { EllipsisOutlined, MessageOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const API_URL = "http://127.0.0.1:8000/feedbacks/";


const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    title: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeedbacks = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(API_URL, { headers });


      setFeedbacks(response.data);
    } catch (error) {
      console.log("Error fetching feedbacks:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => loadFeedbacks(), 500);
    return () => clearTimeout(timer);
  }, []);

  const createFeedback = async () => {
    if (!newFeedback.title || !newFeedback.description) {
      alert("Bạn nên điền đầy đủ thông tin");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.post(API_URL, newFeedback, { headers });

      setNewFeedback({ title: "", description: "" });
      setCreateModalVisible(false);
      loadFeedbacks();
    } catch (error) {
      console.log("Error creating feedback:", error.message);
      alert("Có lỗi xảy ra khi tạo phản ánh");
    } finally {
      setSubmitting(false);
    }
  };


  const handleCardPress = (feedback) => {
    setSelectedFeedback(feedback);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedFeedback(null);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeedbacks();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    return status === "Resolved" ? "green" : "red";
  };

  const items = [
    {
      key: '1',
      label: 'View Details',
    }
  ];

  return (
    <div className="feedback-container" style={styles.container}>
      {loading ? (
        <div style={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <div className="feedback-list">
          <Button 
            type="primary" 
            onClick={onRefresh} 
            loading={refreshing}
            style={{ marginBottom: 16 }}
          >
            Refresh
          </Button>
          
          {feedbacks.map((feedback) => (
            <Card
              key={feedback.id}
              style={styles.card}
              onClick={() => handleCardPress(feedback)}
              title={feedback.title}
              extra={
                <Dropdown menu={{ items }} placement="bottomRight">
                  <Button type="text" icon={<EllipsisOutlined />} />
                </Dropdown>
              }
              actions={[
                <div>
                  <Badge 
                    color={getStatusColor(feedback.status)} 
                    text={feedback.status || "Pending"} 
                  />
                </div>
              ]}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: feedback.description }} 
              />
            </Card>
          ))}

          <Modal
            title={selectedFeedback?.title}
            visible={modalVisible}
            onCancel={handleCloseModal}
            footer={[
              <Button key="close" onClick={handleCloseModal}>
                Close
              </Button>
            ]}
            width={700}
          >
            {selectedFeedback && (
              <>
                <div dangerouslySetInnerHTML={{ __html: selectedFeedback.description }} />
                
                <div style={styles.statusContainer}>
                  <Text strong>Status: </Text>
                  <Badge 
                    color={getStatusColor(selectedFeedback.status)} 
                    text={selectedFeedback.status || "Pending"} 
                  />
                </div>
                
                <Title level={4} style={styles.response}>Response:</Title>
                {selectedFeedback.response?.response ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedFeedback.response.response }} />
                ) : (
                  <Text>No response provided yet.</Text>
                )}
              </>
            )}
          </Modal>

          <Modal
            title="Tạo phản ánh mới"
            visible={createModalVisible}
            onCancel={() => setCreateModalVisible(false)}
            footer={[
              <Button key="cancel" onClick={() => setCreateModalVisible(false)}>
                Hủy
              </Button>,
              <Button 
                key="submit" 
                type="primary" 
                loading={submitting} 
                onClick={createFeedback}
              >
                Gửi
              </Button>
            ]}
          >
            <Input
              placeholder="Tiêu đề"
              value={newFeedback.title}
              onChange={(e) => setNewFeedback((prev) => ({ ...prev, title: e.target.value }))}
              style={styles.input}
            />

            <TextArea
              placeholder="Nội dung"
              value={newFeedback.description}
              onChange={(e) => setNewFeedback((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              style={styles.input}
            />
          </Modal>
        </div>
      )}

      <div style={styles.createButtonContainer}>
        <Button
          type="primary"
          size="large"
          onClick={() => setCreateModalVisible(true)}
          style={styles.createButton}
        >
          Tạo phản ánh mới
        </Button>
      </div>
    </div>
  );
};

// Chuyển đổi StyleSheet.create sang JavaScript object styles
const styles = {
  container: {
    padding: 10,
    position: 'relative',
    minHeight: '100vh'
  },
  card: {
    margin: '8px 0',
    marginBottom: 16,
    cursor: 'pointer'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh'
  },
  input: {
    marginBottom: 16
  },
  statusContainer: {
    margin: '16px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  response: {
    marginTop: 16,
    marginBottom: 8
  },
  createButtonContainer: {
    position: 'sticky',
    bottom: 20,
    width: '100%',
    textAlign: 'center',
    marginTop: 20
  },
  createButton: {
    width: '100%',
    maxWidth: 400
  }
};

export default FeedbackList;