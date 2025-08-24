import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Spin, Alert, Space, Button, Modal, Form, Input, Select, DatePicker, message, Popconfirm } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { Employee, Gender } from "../types/employee.type";
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from "../services/employee.service";
import dayjs from 'dayjs';

const { Option } = Select;

export default function EmployeePage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const mutationCreate = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsModalOpen(false);
      form.resetFields();
      message.success('Thêm nhân sự thành công!');
    },
    onError: () => {
      message.error('Thêm nhân sự thất bại.');
    }
  });

  const mutationUpdate = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsModalOpen(false);
      form.resetFields();
      message.success('Cập nhật nhân sự thành công!');
    },
    onError: () => {
      message.error('Cập nhật nhân sự thất bại.');
    }
  });

  const mutationDelete = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      message.success('Xóa nhân sự thành công!');
    },
    onError: () => {
      message.error('Xóa nhân sự thất bại.');
    }
  });

  const showModal = (type: 'add' | 'edit', employee: Employee | null = null) => {
    setModalType(type);
    setIsModalOpen(true);
    if (type === 'edit' && employee) {
      form.setFieldsValue({
        ...employee,
        dateOfBirth: dayjs(employee.dateOfBirth),
      });
    } else {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: any = {
          ...values,
          dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
          active: true,
        };

        if (modalType === 'edit') {
          payload.id = form.getFieldValue('id');
          if (!values.password) {
            delete payload.password; // nếu không nhập thì bỏ qua
          }
          mutationUpdate.mutate(payload);
        } else {
          mutationCreate.mutate(payload);
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns: ColumnsType<Employee> = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender: Gender) => {
        switch (gender) {
          case "Nam": return "Nam";
          case "Nu": return "Nữ";
          case "Khac": return "Khác";
          default: return "-";
        }
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Employee) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showModal('edit', record)}>
            Edit
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa nhân sự này không?"
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            onConfirm={() => mutationDelete.mutate(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return <Alert message="Error" description={error.message} type="error" showIcon />;
  }
  
  if (!data) {
    return <Alert message="Thông báo" description="Không có dữ liệu nhân viên." type="info" showIcon />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="text-2xl font-semibold" style={{ margin: 0 }}>
          Employee Page
        </h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal('add')}>
          Thêm Nhân sự
        </Button>
      </div>
      <Table 
        dataSource={data} 
        columns={columns} 
        rowKey="id" 
        pagination={false}
      />
      <Modal 
        title={modalType === 'add' ? "Thêm nhân sự mới" : "Sửa thông tin nhân sự"} 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        okText={modalType === 'add' ? "Thêm" : "Lưu"}
      >
        <Form
          form={form}
          layout="vertical"
        >
          {modalType === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
          >
            <Select>
              <Option value="Nam">Nam</Option>
              <Option value="Nu">Nữ</Option>
              <Option value="Khac">Khác</Option>
            </Select>
          </Form.Item>

          {modalType === 'add' && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}

          {modalType === 'edit' && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
