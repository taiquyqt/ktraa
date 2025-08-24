import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Button } from 'antd';
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { IoLogoEuro } from 'react-icons/io5';

const logoStyle = {
  fontSize: '24px',
  color: '#fff',
};

const logoTextStyle = {
  color: '#fff',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: 0,
  whiteSpace: 'nowrap',
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: 'employees',
      icon: <UserOutlined />,
      label: <NavLink to="/employee">Employees</NavLink>,
    },
  ];

  return (
    <div
      style={{
        width: collapsed ? 80 : 220,
        backgroundColor: '#001529',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s',
      }}
    >
      {/* Logo + Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: '16px',
        }}
      >
        <IoLogoEuro style={logoStyle} />
        {!collapsed && <h1 style={logoTextStyle}>Managerments</h1>}

        <Button
          type="text"
          onClick={toggleCollapsed}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          style={{ color: '#fff' }}
        />
      </div>

      {/* Menu */}
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['employees']}
        inlineCollapsed={collapsed}
        items={menuItems}
      />
    </div>
  );
}
