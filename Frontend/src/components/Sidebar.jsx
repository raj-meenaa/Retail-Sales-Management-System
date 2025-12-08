import {
  FiHome,
  FiLayers,
  FiDownload,
  FiFileText,
  FiChevronDown,
} from "react-icons/fi";
import { useState } from "react";

const Sidebar = () => {
  const [servicesOpen, setServicesOpen] = useState(true);
  const [invoicesOpen, setInvoicesOpen] = useState(true);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            V
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Vault</h3>
            <p className="text-xs text-gray-500">Anurag Yadav</p>
          </div>
          <FiChevronDown className="text-gray-400" />
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1 mb-6">
          <NavItem icon={FiHome} label="Dashboard" active />
          <NavItem icon={FiLayers} label="Nexus" />
          <NavItem icon={FiDownload} label="Intake" />
        </div>

        <div className="mb-6">
          <button
            onClick={() => setServicesOpen(!servicesOpen)}
            className="flex items-center justify-between w-full text-xs font-medium text-gray-500 uppercase mb-2"
          >
            Services
          </button>
          {servicesOpen && (
            <div className="space-y-1">
              <SubNavItem icon="circle" label="Pre-active" />
              <SubNavItem icon="circle" label="Active" />
              <SubNavItem icon="circle-slash" label="Blocked" />
              <SubNavItem icon="circle" label="Closed" />
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => setInvoicesOpen(!invoicesOpen)}
            className="flex items-center justify-between w-full text-xs font-medium text-gray-500 uppercase mb-2"
          >
            Invoices
          </button>
          {invoicesOpen && (
            <div className="space-y-1">
              <SubNavItem icon="file" label="Proforma Invoices" />
              <SubNavItem icon="file" label="Final Invoices" />
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active }) => (
  <button
    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
      active
        ? "bg-gray-100 text-gray-900 font-medium"
        : "text-gray-600 hover:bg-gray-50"
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const SubNavItem = ({ icon, label }) => {
  const getIcon = () => {
    switch (icon) {
      case "circle":
        return (
          <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
        );
      case "circle-slash":
        return (
          <div className="w-4 h-4 rounded-full border-2 border-gray-400 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-0.5 bg-gray-400 rotate-45"></div>
            </div>
          </div>
        );
      case "file":
        return <FiFileText size={16} className="text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
      {getIcon()}
      <span>{label}</span>
    </button>
  );
};

export default Sidebar;
