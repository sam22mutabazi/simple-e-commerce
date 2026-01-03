import React, { useRef, useState } from 'react';
import { Row, Col, Card, Container, Spinner, Table, Badge, Button, Stack, Form, InputGroup, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  useGetSummaryQuery, 
  useGetSalesDataQuery, 
  useGetTopProductsQuery,
  useGetOrdersQuery 
} from '../../slices/ordersApiSlice';
import { useGetUsersQuery } from '../../slices/usersApiSlice';
import { useGetLowStockProductsQuery } from '../../slices/productsApiSlice';
import SalesChart from '../../components/Admin/SalesChart';
import TopProductsChart from '../../components/Admin/TopProductsChart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

const AdminDashboardScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: summary, isLoading: loadingSummary, error: errorSummary } = useGetSummaryQuery();
  const { data: salesData, isLoading: loadingSales } = useGetSalesDataQuery();
  const { data: topProducts, isLoading: loadingTop } = useGetTopProductsQuery();
  const { data: lowStockItems, isLoading: loadingLowStock } = useGetLowStockProductsQuery();
  const { data: orders, isLoading: loadingOrders } = useGetOrdersQuery();
  const { data: users } = useGetUsersQuery();

  const reportRef = useRef();

  const formatRWF = (num) => Number(num || 0).toLocaleString('en-RW');

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  const downloadPDF = async () => {
    const input = reportRef.current;
    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.setFontSize(14);
    pdf.text('Business Analytics Performance Report', 10, 10);
    pdf.addImage(imgData, 'PNG', 0, 15, pdfWidth, pdfHeight);
    pdf.save(`Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(salesData || []), "Monthly Sales");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(topProducts || []), "Top Products");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(orders || []), "Recent Orders");
    XLSX.writeFile(wb, `Store_Data_Export.xlsx`);
  };

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-4 g-3">
        <Col md={4}>
          <h2 className="fw-bold mb-0">Command Center</h2>
          <p className="text-muted small mb-0">Manage sales, stock, and customers</p>
        </Col>
        <Col md={4}>
          <InputGroup className="shadow-sm border rounded">
            <InputGroup.Text className="bg-white border-0">
              <i className="fas fa-search text-muted"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search customers by name or email..."
              className="border-0 ps-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4} className="text-md-end">
          <Stack direction="horizontal" gap={2} className="justify-content-md-end">
            <Button variant="outline-dark" size="sm" onClick={exportToExcel} className="fw-bold shadow-sm">
              <i className="fas fa-file-excel me-1"></i> Excel
            </Button>
            <Button variant="primary" size="sm" onClick={downloadPDF} className="fw-bold shadow-sm">
              <i className="fas fa-file-pdf me-1"></i> Save PDF
            </Button>
          </Stack>
        </Col>
      </Row>

      {searchTerm && (
        <Card className="mb-4 shadow border-0 overflow-hidden animate-fade-in">
          <Card.Header className="bg-light small fw-bold text-uppercase py-2">Search Results</Card.Header>
          <ListGroup variant="flush">
            {filteredUsers?.map(user => (
              <ListGroup.Item key={user._id} className="d-flex justify-content-between align-items-center py-3">
                <div>
                  <div className="fw-bold">{user.name}</div>
                  <div className="text-muted small">{user.email}</div>
                </div>
                <Link to={`/admin/user/${user._id}/edit`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                  Edit Profile
                </Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}

      {loadingSummary ? (
        <div className='text-center my-5'><Spinner animation='border' variant="primary" /></div>
      ) : errorSummary ? (
        <div className='alert alert-danger shadow-sm'>{errorSummary.data?.message || 'Connection Error'}</div>
      ) : (
        <div ref={reportRef}>
          {/* Main Metrics Row - UPDATED to 4 COLUMNS */}
          <Row className="mb-4 g-3">
            <Col md={3}>
              <Card className='bg-success text-white border-0 shadow-sm p-4 h-100'>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small className="text-uppercase fw-bold opacity-75">Revenue</small>
                    <h4 className="fw-bold mt-1 mb-0">{formatRWF(summary?.totalSales)}</h4>
                  </div>
                  <div className="bg-white bg-opacity-25 p-2 rounded"><i className="fas fa-money-bill-wave"></i></div>
                </div>
              </Card>
            </Col>
            <Col md={3}>
              <Card className='bg-primary text-white border-0 shadow-sm p-4 h-100'>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small className="text-uppercase fw-bold opacity-75">Orders</small>
                    <h4 className="fw-bold mt-1 mb-0">{summary?.numOrders}</h4>
                  </div>
                  <div className="bg-white bg-opacity-25 p-2 rounded"><i className="fas fa-box-open"></i></div>
                </div>
              </Card>
            </Col>
            <Col md={3}>
              <Card className='bg-warning text-dark border-0 shadow-sm p-4 h-100'>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small className="text-uppercase fw-bold opacity-75">Items In Stock</small>
                    <h4 className="fw-bold mt-1 mb-0">{summary?.totalStockUnits}</h4>
                  </div>
                  <div className="bg-dark bg-opacity-10 p-2 rounded"><i className="fas fa-warehouse"></i></div>
                </div>
              </Card>
            </Col>
            <Col md={3}>
              <Card className='bg-dark text-white border-0 shadow-sm p-4 h-100'>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small className="text-uppercase fw-bold opacity-75">Customers</small>
                    <h4 className="fw-bold mt-1 mb-0">{summary?.numUsers}</h4>
                  </div>
                  <div className="bg-white bg-opacity-25 p-2 rounded"><i className="fas fa-users"></i></div>
                </div>
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            <Col lg={8}>
              <Card className="p-4 border-0 shadow-sm">
                <h6 className="fw-bold mb-4 text-muted"><i className="fas fa-chart-line me-2"></i>REVENUE OVER TIME</h6>
                {loadingSales ? <Spinner animation="grow" /> : <SalesChart data={salesData} />}
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="p-4 border-0 shadow-sm h-100">
                <h6 className="fw-bold mb-4 text-muted"><i className="fas fa-star me-2"></i>BEST SELLERS</h6>
                {loadingTop ? <Spinner animation="grow" /> : <TopProductsChart data={topProducts} />}
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg={7}>
              <Card className="border-0 shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">Recent Transactions</h6>
                  <Link to="/admin/orderlist" className="small fw-bold text-decoration-none">View All</Link>
                </div>
                {loadingOrders ? <Spinner animation="border" size="sm" /> : (
                  <Table responsive hover className="align-middle border-top m-0">
                    <thead>
                      <tr className="text-muted small">
                        <th>ORDER ID</th>
                        <th>TOTAL</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {orders?.slice(0, 5).map(order => (
                        <tr key={order._id}>
                          <td className="text-muted">#{order._id.slice(-6)}</td>
                          <td className="fw-bold">{formatRWF(order.totalPrice)}</td>
                          <td>
                            <Badge bg={order.isPaid ? "success" : "warning"} className="px-2 py-1">
                              {order.isPaid ? 'PAID' : 'PENDING'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card>
            </Col>

            <Col lg={5}>
              <Card className="border-0 shadow-sm p-4 h-100">
                <h6 className="fw-bold text-danger mb-3"><i className="fas fa-exclamation-triangle me-2"></i>Stock Alerts</h6>
                {loadingLowStock ? <Spinner animation="border" size="sm" /> : (
                  <div className="list-group list-group-flush">
                    {lowStockItems?.length > 0 ? lowStockItems.slice(0, 5).map(item => (
                      <div key={item._id} className="list-group-item d-flex justify-content-between align-items-center px-0 border-0 border-bottom">
                        <div>
                          <div className="fw-bold small">{item.name}</div>
                          <small className="text-muted">Units: {item.countInStock}</small>
                        </div>
                        <Link to={`/admin/product/${item._id}/edit`} className="btn btn-sm btn-light border py-1">
                          Restock
                        </Link>
                      </div>
                    )) : <p className="text-center text-muted py-3">All inventory is healthy.</p>}
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
};

export default AdminDashboardScreen;