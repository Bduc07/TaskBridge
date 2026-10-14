type SidebarProps = {
  activePage: string;
  onPageChange: (page: string) => void;
  userName: string;
  onLogout: () => void;
};

function Sidebar({
  activePage,
  onPageChange,
  userName,
  onLogout,
}: SidebarProps) {
  const pages = ["Dashboard", "Projects", "Tasks"];

  return (
    <aside className="sidebar">
      <div>
        <h2 className="sidebar-logo">TaskBridge</h2>
        <p className="sidebar-welcome">
          Welcome, {userName || "User"}!
        </p>
      </div>

      <nav>
        {pages.map((page) => (
          <button
            key={page}
            className={`sidebar-link ${
              activePage === page ? "active" : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-logout"
          onClick={onLogout}
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;