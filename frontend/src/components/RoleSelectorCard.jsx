export default function RoleSelectorCard({ role, setRole, startInterview }) {
  return (    <div style={{
      width: "350px",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      background: "#fff"
    }}>

      <h2 style={{ marginBottom: "15px", textAlign: "center" }}>
        Select Interview Role
      </h2>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px"
        }}
      >
        <option value="">-- Choose Role --</option>
        <option value="software_engineer">Software Engineer</option>
        <option value="data_analyst">Data Analyst</option>
        <option value="sales_associate">Sales Associate</option>
        <option value="retail_associate">Retail Associate</option>
        <option value="hr_interview">HR Interview</option>
        <option value="backend_developer">Backend Developer</option>
        <option value="product_manager">Product Manager</option>
      </select>

      <button
        onClick={startInterview}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          background: "black",
          color: "white",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Start Interview
      </button>

    </div>
  );
}

