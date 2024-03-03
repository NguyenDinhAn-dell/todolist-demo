import { actions, useStore } from './store';
import { useRef, useState, useEffect } from 'react';
import './App.css';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Col, Row, Button, Space, Input, Table, Card, message, Modal, Popconfirm, Checkbox } from 'antd';



function App() {
  const [state, dispatch] = useStore();
  const { todos, todoInput } = state;
  const inputRef = useRef();

  const [messageApi, contextHolder] = message.useMessage();
  const [editingIndex, setEditingIndex] = useState(null);
  const [open, setOpen] = useState(false);

  const [checkedItems, setCheckedItems] = useState(() => {
    const storedItems = localStorage.getItem('checkedItems');
    return storedItems ? JSON.parse(storedItems) : {};
  });

  const handleAdd = () => {
    if (todoInput.replaceAll(' ', '').length > 0) {
      dispatch(actions.addTodo(todoInput));
      dispatch(actions.setToDoInput(""));
      setCheckedItems((prevCheckedItems) => {
        const newItemIndex = todos.length;
        return { ...prevCheckedItems, [newItemIndex]: false };
      });
      console.log('Added');
      inputRef.current.focus();
    } else {
      console.log('Failed Add');
      dispatch(actions.setToDoInput(""));
      inputRef.current.focus();
      messageApi.open({
        type: 'warning',
        content: 'Please enter something',
      });
    }
  };


  const handleEdit = (text, index) => {
    setOpen(true);
    console.log('Editing')
    dispatch(actions.setToDoInput(""))
    setEditingIndex(index)
    dispatch(actions.setToDoInput(text.item))
    
  }

  const handleUpdate = () => {
    if (editingIndex !== null && todoInput.replaceAll(' ', '').length > 0) {
      dispatch(actions.setToDoInput(""))
      console.log('Update')
      dispatch(actions.editTodo({ index: editingIndex, updatedTodo: todoInput }));
      setEditingIndex(null);

      setOpen(false)
    } else {
      console.log('Failed Update')

      messageApi.open({
        type: 'warning',
        content: 'Please enter something',
      });
    }
  };
  const confirm = (id) => {
    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = { ...prevCheckedItems };
      delete updatedCheckedItems[id];
  
      
      const updatedIndices = {};
      Object.keys(updatedCheckedItems).forEach((key, index) => {
        updatedIndices[index] = updatedCheckedItems[key];
      });
  
      return updatedIndices;
    });
    dispatch(actions.deleteTodo(id));
  };
  const cancel = () => {
    setOpen(false);
  };



  useEffect(() => {
    localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const handleCancel = () => {
    dispatch(actions.setToDoInput(''));
    console.log('Cancel')
    setEditingIndex(null);
    setOpen(false);
  };




  const columns = [
    {
      fontFamily: "Lucida Console",
      width: 130,
      title: 'List',
      dataIndex: 'item',
      key: 'item',
      render: (text, record) => (
        <div style={{ width: '130px', 
                      textDecorationLine: checkedItems[record.id] ? 'line-through' : 'none',
                      color: checkedItems[record.id] ? '#00000040' : '#000000E0'  }}>
          {text}
        </div>
      ),
    },
    {
      align: 'center',
      title: 'Check',
      key: 'check',
      render: (text, record) => (
        <Space>
          <Checkbox
            checked={checkedItems[record.id]}
            onChange={() => {
              setCheckedItems((prevCheckedItems) => ({
                ...prevCheckedItems,
                [record.id]: !prevCheckedItems[record.id],
              }));
            }}
          />
        </Space>
      ),
    },

    {
      align: 'center',
      title: 'Edit',
      key: 'edit',
      render: (text, record, index) => (
        <Space >
          
          <Button type="primary" onClick={() => handleEdit(text, index)} disabled={checkedItems[index]}  >
            <EditOutlined />
          </Button>
         
        </Space>
      ),
    },

    {
      align: 'center',
      title: 'Delete',
      key: 'delete',
      render: (text, record, index) => (
        <Space >
          
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => confirm(index)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger><DeleteOutlined /></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const data = todos.map((item, index) => ({
    key: index,
    id: index,
    item,
  }));

  return (
    
    <Row  align='middle' justify='center' style={{ paddingTop: 10 }}>
      {console.log('render')}
        {contextHolder}
  
      <Modal
        open={open}
        title="Edit"
        onOk={handleUpdate}
        okText='Save'
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
        >
        <Input
          ref={inputRef}
          value={todoInput}
          placeholder='Editing todo...'
          onChange={(e) => {
            dispatch(actions.setToDoInput(e.target.value));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              handleUpdate();
          }}

        />
      </Modal>

      <Col >
        <Card title={<div style={{
                      fontFamily: "Lucida Console",textAlign: 'center', backgroundColor: '#f7f5ed',borderRadius: 10}}><h1 > 
                      TODO APP</h1></div>} style={{ width: 400, backgroundColor:'#f9d32c' }}>
        
          <Card>
            <div>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  ref={inputRef}
                  value={todoInput}
                  placeholder='Enter todo...'
                  onChange={(e) => {
                    dispatch(actions.setToDoInput(e.target.value));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      handleAdd();
                  }}
                />
                <div>
                  <Button
                    type="primary"
                    style={{backgroundColor: 'green'}}
                    onClick={handleAdd}>
                    Add
                  </Button>
                </div>
              </Space.Compact>
            </div>
          </Card>
          <Card
            size="small"
            title='Todo list'>
            <Table
              dataSource={data}
              columns={columns}
              pagination={data.length && { defaultPageSize: 7, hideOnSinglePage: true, position: ['bottomCenter'], onChange:() =>{} }}
              bordered
              size="middle"
            />
          </Card>
        </Card>
      </Col>
    </Row>
  );
}

export default App;