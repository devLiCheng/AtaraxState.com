import { useState, useEffect } from 'react'
import {
  Layout,
  Menu,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Popconfirm,
  message,
  Tag,
  Card,
  Typography,
} from 'antd'
import {
  ShoppingOutlined,
  BookOutlined,
  FileTextOutlined,
  LogoutOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import axios from 'axios'

const { Header, Content, Sider } = Layout
const { Title, Text } = Typography

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentMenu, setCurrentMenu] = useState('products')
  const [loading, setLoading] = useState(false)

  // Data States
  const [products, setProducts] = useState([])
  const [articles, setArticles] = useState([])
  const [orders, setOrders] = useState([])

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [productForm] = Form.useForm()

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<any>(null)
  const [articleForm] = Form.useForm()

  const [viewingOrder, setViewingOrder] = useState<any>(null)

  // check if logged in on load
  useEffect(() => {
    const user = localStorage.getItem('admin_user')
    if (user) {
      setIsLoggedIn(true)
    }
  }, [])

  // fetch data when tab changes or logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchData()
    }
  }, [isLoggedIn, currentMenu])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (currentMenu === 'products') {
        const res = await axios.get('/api/admin/products')
        setProducts(res.data)
      } else if (currentMenu === 'articles') {
        const res = await axios.get('/api/admin/articles')
        setArticles(res.data)
      } else if (currentMenu === 'orders') {
        const res = await axios.get('/api/admin/orders')
        setOrders(res.data)
      }
    } catch (err: any) {
      message.error('Failed to load data: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  // Admin Login Handler
  const handleLogin = async (values: any) => {
    try {
      const res = await axios.post('/api/admin/login', values)
      if (res.data.success) {
        localStorage.setItem('admin_user', JSON.stringify(res.data.user))
        setIsLoggedIn(true)
        message.success('Welcome back, Admin.')
      }
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Login failed')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_user')
    setIsLoggedIn(false)
  }

  // --- Products CRUD handlers ---
  const openAddProductModal = () => {
    setEditingProduct(null)
    productForm.resetFields()
    setIsProductModalOpen(true)
  }

  const openEditProductModal = (product: any) => {
    setEditingProduct(product)
    productForm.setFieldsValue({
      ...product,
      price: Number(product.price),
    })
    setIsProductModalOpen(true)
  }

  const handleProductSubmit = async (values: any) => {
    try {
      if (editingProduct) {
        await axios.put(`/api/admin/products?id=${editingProduct.id}`, values)
        message.success('Product updated.')
      } else {
        await axios.post('/api/admin/products', values)
        message.success('Product created.')
      }
      setIsProductModalOpen(false)
      fetchData()
    } catch (err: any) {
      message.error(err.response?.data?.error || err.message)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      await axios.delete(`/api/admin/products?id=${id}`)
      message.success('Product deleted.')
      fetchData()
    } catch (err: any) {
      message.error(err.response?.data?.error || err.message)
    }
  }

  // --- Articles CRUD handlers ---
  const openAddArticleModal = () => {
    setEditingArticle(null)
    articleForm.resetFields()
    setIsArticleModalOpen(true)
  }

  const openEditArticleModal = (article: any) => {
    setEditingArticle(article)
    articleForm.setFieldsValue(article)
    setIsArticleModalOpen(true)
  }

  const handleArticleSubmit = async (values: any) => {
    try {
      if (editingArticle) {
        await axios.put(`/api/admin/articles?id=${editingArticle.id}`, values)
        message.success('Article updated.')
      } else {
        await axios.post('/api/admin/articles', values)
        message.success('Article created.')
      }
      setIsArticleModalOpen(false)
      fetchData()
    } catch (err: any) {
      message.error(err.response?.data?.error || err.message)
    }
  }

  const handleDeleteArticle = async (id: number) => {
    try {
      await axios.delete(`/api/admin/articles?id=${id}`)
      message.success('Article deleted.')
      fetchData()
    } catch (err: any) {
      message.error(err.response?.data?.error || err.message)
    }
  }

  // --- Orders status update ---
  const handleOrderStatusUpdate = async (id: number, status: string) => {
    try {
      await axios.put(`/api/admin/orders?id=${id}`, { status })
      message.success('Order status updated.')
      fetchData()
    } catch (err: any) {
      message.error(err.response?.data?.error || err.message)
    }
  }

  // --- Login Screen Render ---
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
        <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>ATARAX STATE - ADMIN</Title>
          <Form onFinish={handleLogin} layout="vertical">
            <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter username' }]}>
              <Input placeholder="admin" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter password' }]}>
              <Input.Password placeholder="admin" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }

  // --- Table Columns Definition ---
  const productColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      render: (img: string) => <img src={img} style={{ width: 40, height: 40, objectFit: 'cover' }} alt="" />,
    },
    { title: 'Name (EN)', dataIndex: 'nameEn', key: 'nameEn' },
    { title: 'Name (ZH)', dataIndex: 'nameZh', key: 'nameZh' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag>{cat}</Tag> },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (val: any) => `$${Number(val).toFixed(2)}` },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => openEditProductModal(record)}>Edit</Button>
          <Popconfirm title="Delete this product?" onConfirm={() => handleDeleteProduct(record.id)}>
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const articleColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Cover',
      dataIndex: 'coverImage',
      key: 'coverImage',
      render: (img: string) => <img src={img} style={{ width: 60, height: 40, objectFit: 'cover' }} alt="" />,
    },
    { title: 'Title (EN)', dataIndex: 'titleEn', key: 'titleEn' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => openEditArticleModal(record)}>Edit</Button>
          <Popconfirm title="Delete this article?" onConfirm={() => handleDeleteArticle(record.id)}>
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const orderColumns = [
    { title: 'Order No', dataIndex: 'orderNo', key: 'orderNo' },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Phone', dataIndex: 'customerPhone', key: 'customerPhone' },
    { title: 'Total', dataIndex: 'totalAmount', key: 'totalAmount', render: (val: any) => `$${Number(val).toFixed(2)}` },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'gold'
        if (status === 'PAID') color = 'blue'
        if (status === 'SHIPPED') color = 'purple'
        if (status === 'COMPLETED') color = 'green'
        return <Tag color={color}>{status}</Tag>
      },
    },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => new Date(d).toLocaleDateString() },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => setViewingOrder(record)}>Details</Button>
          {record.status === 'PAID' && (
            <Button size="small" type="primary" onClick={() => handleOrderStatusUpdate(record.id, 'SHIPPED')}>
              Ship
            </Button>
          )}
          {record.status === 'SHIPPED' && (
            <Button size="small" onClick={() => handleOrderStatusUpdate(record.id, 'COMPLETED')}>
              Complete
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar navigation */}
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', letterSpacing: 1 }}>ATARAX STATE</Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentMenu]}
          onClick={(e) => setCurrentMenu(e.key)}
          items={[
            { key: 'products', icon: <ShoppingOutlined />, label: 'Products' },
            { key: 'articles', icon: <BookOutlined />, label: 'Articles' },
            { key: 'orders', icon: <FileTextOutlined />, label: 'Orders' },
          ]}
        />
      </Sider>

      {/* Main Content Layout */}
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0 }}>
            {currentMenu.toUpperCase()} MANAGEMENT
          </Title>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {/* Action Bar */}
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            {currentMenu === 'products' && (
              <Button type="primary" icon={<PlusOutlined />} onClick={openAddProductModal}>
                Add Product
              </Button>
            )}
            {currentMenu === 'articles' && (
              <Button type="primary" icon={<PlusOutlined />} onClick={openAddArticleModal}>
                Add Article
              </Button>
            )}
          </div>

          {/* Tables */}
          {currentMenu === 'products' && (
            <Table dataSource={products} columns={productColumns} rowKey="id" loading={loading} />
          )}
          {currentMenu === 'articles' && (
            <Table dataSource={articles} columns={articleColumns} rowKey="id" loading={loading} />
          )}
          {currentMenu === 'orders' && (
            <Table dataSource={orders} columns={orderColumns} rowKey="id" loading={loading} />
          )}
        </Content>
      </Layout>

      {/* --- Products Modal --- */}
      <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        open={isProductModalOpen}
        onCancel={() => setIsProductModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form form={productForm} onFinish={handleProductSubmit} layout="vertical">
          <Form.Item name="nameZh" label="Name (Chinese)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nameEn" label="Name (English)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select options={[{ value: 'bracelet', label: 'Bracelet / 手串' }, { value: 'necklace', label: 'Necklace / 项链' }]} />
          </Form.Item>
          <Form.Item name="price" label="Price (USD)" rules={[{ required: true }]}>
            <InputNumber min={0.01} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="images" label="Image Path" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="storyZh" label="Story (Chinese)">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="storyEn" label="Story (English)">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="detailsZh" label="Specs/Details (Chinese - Separate by | or newlines)">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="detailsEn" label="Specs/Details (English - Separate by | or newlines)">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="careZh" label="Care Instructions (Chinese)">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="careEn" label="Care Instructions (English)">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item>
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsProductModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* --- Articles Modal --- */}
      <Modal
        title={editingArticle ? 'Edit Article' : 'Add Article'}
        open={isArticleModalOpen}
        onCancel={() => setIsArticleModalOpen(false)}
        footer={null}
        width={800}
      >
        <Form form={articleForm} onFinish={handleArticleSubmit} layout="vertical">
          <Form.Item name="titleZh" label="Title (Chinese)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="titleEn" label="Title (English)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="URL Slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="keywords" label="SEO Keywords" rules={[{ required: true }]}>
            <Input placeholder="keywords, comma, separated" />
          </Form.Item>
          <Form.Item name="coverImage" label="Cover Image Path" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="summaryZh" label="Summary (Chinese)" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="summaryEn" label="Summary (English)" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="contentZh" label="Content (Chinese - Markdown Supported)" rules={[{ required: true }]}>
            <Input.TextArea rows={8} />
          </Form.Item>
          <Form.Item name="contentEn" label="Content (English - Markdown Supported)" rules={[{ required: true }]}>
            <Input.TextArea rows={8} />
          </Form.Item>
          <Form.Item>
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsArticleModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* --- Order Details Drawer/Modal --- */}
      <Modal
        title="Order Details"
        open={viewingOrder !== null}
        onCancel={() => setViewingOrder(null)}
        footer={[
          <Button key="close" onClick={() => setViewingOrder(null)}>
            Close
          </Button>,
        ]}
      >
        {viewingOrder && (
          <div>
            <p><strong>Order No:</strong> {viewingOrder.orderNo}</p>
            <p><strong>Customer:</strong> {viewingOrder.customerName}</p>
            <p><strong>Phone:</strong> {viewingOrder.customerPhone}</p>
            <p><strong>Address:</strong> {viewingOrder.customerAddress}</p>
            <p><strong>Total Paid:</strong> ${Number(viewingOrder.totalAmount).toFixed(2)}</p>
            <p><strong>Status:</strong> <Tag color="blue">{viewingOrder.status}</Tag></p>

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>Items ordered:</h4>
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 4, padding: '12px 16px' }}>
              {viewingOrder.orderItems?.map((item: any) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span>{item.product?.nameEn} (x{item.quantity})</span>
                  <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  )
}

export default App
