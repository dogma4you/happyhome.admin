import Table from "../Components/Table";

const Dashboard = () => {

  const dashboardItems = {
    columns: [
      { key: 'id', title: 'ID', sort: true },
      { key: 'name', title: 'Name', sort: true },
      { key: 'age', title: 'Age', sort: false },
      { key: 'actions', title: 'Actions', sort: false }
    ],
    initialRows: [
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
    pagination: true
  }

  const handleEdit = (id) => {
    console.log(`Edit item with id: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete item with id: ${id}`);
  };
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-end">
        <div className="w-72">
          <div className="relative h-10 w-full min-w-[200px] ">
            <input type="text" placeholder="Search"
              className="peer h-full w-full rounded-[7px]  !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-blue-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-blue-700 focus:border-t-transparent focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50" />
          </div>
        </div>
      </div>
      <Table
        initialColumns={dashboardItems.columns}
        initialRows={dashboardItems.initialRows}
        searchInput={dashboardItems.searchInput}
        pagination={dashboardItems.pagination}
      />
    </div>
  );
};

export default Dashboard;