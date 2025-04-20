import React, { useEffect, useState } from "react";
import axios from "axios";

import { 
  Card, 
  Typography, 
  Radio, 
  Modal, 
  Button, 
  Badge, 
  Avatar, 
  Spin, 
  Empty,
  Space,
  Divider
} from "antd";

import { DatabaseOutlined, SearchOutlined, FileSearchOutlined } from "@ant-design/icons";
const { Text, Title, Paragraph } = Typography;
const { Group: RadioGroup } = Radio;

// Debounce utility function
const debounce = (callback, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};

const Survey = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [answers, setAnswers] = useState({});
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const API_URL = "http://127.0.0.1:8000";

  const loadSurveys = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_URL}/surveys/`, { headers });
      setSurveys(response.data);
    } catch (ex) {
      console.error("Error loading surveys:", ex);
    } finally {
      setLoading(false);
    }
  };

  const loadSurveyDetails = async (surveyId) => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_URL}/surveys/${surveyId}/`, { headers });
      setSelectedSurvey(response.data);
    } catch (ex) {
      console.error("Error loading survey details:", ex);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSurveys();
    setRefreshing(false);
  };

  const handleCardPress = async (survey) => {
    setLoading(true);
    await loadSurveyDetails(survey.id);
    setLoading(false);
  };

  const submitSurvey = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const formattedAnswers = Object.entries(answers).map(
        ([questionId, optionId]) => ({
          question: parseInt(questionId),
          option: parseInt(optionId),
        })
      );

      await axios.post(
        `${API_URL}/surveys/${selectedSurvey.id}/submit_response/`, 
        { answers: formattedAnswers },
        { headers }
      );

      alert("Gửi khảo sát thành công!");
      setSelectedSurvey(null);
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Có lỗi xảy ra khi gửi khảo sát.");
    }
  };

  // Gọi hàm debounce cho submit
  const handleSubmitSurvey = debounce(submitSurvey, 1000);

  useEffect(() => {
    let timer = setTimeout(() => loadSurveys(), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading && !selectedSurvey) {
    return (
      <div style={styles.center}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.refreshContainer}>
        <Button type="primary" onClick={onRefresh} loading={refreshing}>
          Refresh
        </Button>
      </div>
      
      <div style={styles.scrollContainer}>
        {surveys.length === 0 ? (
          <Empty description="Không có khảo sát nào!" />
        ) : (
          surveys.map((s) => (
            <Card
              key={s.id}
              style={styles.card}
              onClick={() => handleCardPress(s)}
              title={
                <Space>
                  <Avatar icon={<DatabaseOutlined  />} />
                  <span>{s.title}</span>
                </Space>
              }
            >
              <Badge
                status={s.status === "Published" ? "success" : "error"}
                text={`Tình trạng: ${s.status}`}
                style={styles.status}
              />
              <Paragraph style={styles.description}>{s.description}</Paragraph>
              <Text type="secondary" style={styles.dateText}>
                Thời gian: {new Date(s.start_date).toLocaleDateString("vi-VN")} -{" "}
                {new Date(s.end_date).toLocaleDateString("vi-VN")}
              </Text>
            </Card>
          ))
        )}
      </div>

      <Modal
        title={selectedSurvey?.title}
        open={selectedSurvey !== null}
        onCancel={() => setSelectedSurvey(null)}
        width={700}
        footer={[
          <Button key="close" onClick={() => setSelectedSurvey(null)}>
            Đóng
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmitSurvey}>
            Gửi
          </Button>
        ]}
      >
        {selectedSurvey && selectedSurvey.questions && (
          <div style={styles.modalContent}>
            {selectedSurvey.questions.map((question) => (
              <div key={question.id} style={styles.questionContainer}>
                <Title level={5}>{question.content}</Title>
                <RadioGroup
                  value={answers[question.id]}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question.id]: e.target.value,
                    }))
                  }
                >
                  <Space direction="vertical" style={styles.optionsContainer}>
                    {question.options.map((option) => (
                      <Radio key={option.id} value={option.id}>
                        {option.content}
                      </Radio>
                    ))}
                  </Space>
                </RadioGroup>
                <Divider />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    padding: 16,
    maxWidth: 1000,
    margin: '0 auto'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  },
  refreshContainer: {
    marginBottom: 16
  },
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  card: {
    marginBottom: 16,
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  modalContent: {
    maxHeight: '60vh',
    overflow: 'auto',
    paddingRight: 16
  },
  questionContainer: {
    marginBottom: 24
  },
  optionsContainer: {
    marginTop: 8,
    marginLeft: 8
  },
  dateText: {
    fontSize: 12
  },
  description: {
    fontSize: 14,
    margin: '12px 0'
  },
  status: {
    display: 'block',
    marginBottom: 8,
    fontSize: 12
  }
};

export default Survey;