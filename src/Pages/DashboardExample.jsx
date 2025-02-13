import Table from "../Components/Table";

const Dashboard = () => {

  const dashboardItems = {
    columns: [
      { key: 'id', title: 'ID', sort: true },
      { key: 'name', title: 'Name', sort: true },
      { key: 'age', title: 'Age', sort: false },
      { key: 'actions', title: 'Actions', sort: false }
    ],
    rows: [
      {
        id: 1, name: 'John Doe', age: 30, actions: [
          { name: 'Edit', action: () => handleEdit(1) },
          { name: 'Delete', action: () => handleDelete(1) }
        ]
      },
      {
        id: 2, name: 'Jane Smith', age: 25, actions: [
          { name: 'Edit', action: () => handleEdit(2) },
          { name: 'Delete', action: () => handleDelete(2) }
        ]
      },
      {
        id: 3, name: 'Jane Doe', age: 18, actions: [
          { name: 'Edit', action: () => handleEdit(3) },
          { name: 'Delete', action: () => handleDelete(3) }
        ]
      },
      {
        id: 4, name: 'Chris Doe', age: 33, actions: [
          { name: 'Edit', action: () => handleEdit(4) },
          { name: 'Delete', action: () => handleDelete(4) }
        ]
      },
      {
        id: 5, name: 'Lisa Smith', age: 46, actions: [
          { name: 'Edit', action: () => handleEdit(5) },
          { name: 'Delete', action: () => handleDelete(5) }
        ]
      },
    ],
    searchInput: true,
    pagination: true,
    limit: true
  }

  const handleEdit = (id) => {
    console.log(`Edit item with id: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete item with id: ${id}`);
  };
  return (
    <div className="w-full">
      <Table
        dashboard={dashboardItems}
      />
    </div>
  );
};

export default Dashboard;