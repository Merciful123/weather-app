import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Table, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get("http://localhost:5000/api/cities");
        const response = await axios.get(
          "https://weather-app-api-awl8.onrender.com/api/cities"
        );
        setCities(response?.data?.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "City Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
       
    },
    {
      title: "Country",
      dataIndex: "cou_name_en",
      key: "country",
      ...getColumnSearchProps("cou_name_en"),
      sorter: (a, b) => a.cou_name_en.localeCompare(b.cou_name_en),
      sortDirections: ["descend", "ascend"],
       
    },
    {
      title: "Timezone",
      dataIndex: "timezone",
      key: "timezone",
      ...getColumnSearchProps("timezone"),
      sorter: (a, b) => a.timezone.localeCompare(b.timezone),
      sortDirections: ["descend", "ascend"],
     
    },
  ];

  const handleRowClick = (record) => {
    const { lat, lon } = record.coordinates;
    console.log(record);
    navigate(`/weather/${lat}/${lon}`);
  };

  return (
    <div className="flex flex-col min-[792px]:w-[100vw] mx-auto justify-center items-center bg-blue-100">
      <h1 className="mb-4">Weather App </h1>
      <Table
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        columns={columns}
        dataSource={cities}
        loading={loading}
      />
    </div>
  );
};

export default CitiesTable;
