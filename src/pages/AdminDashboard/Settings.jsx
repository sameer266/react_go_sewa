import React, { useEffect, useState } from "react";
import { AdminSettingsLists, AdminSettingsUpdate } from "../../api/adminApi";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../components/Loader";
import { Edit2, Save, X, Image, Building, Mail, Phone, MapPin } from "lucide-react";
import Sidebar from '../../components/SideBar';
import { MenuLinks } from './Link';

const Settings = () => {
  const [settings, setSettings] = useState({
    systemLogo: null,
    systemName: "Go Sewa",
    contactEmail: "admin@busmanagement.com",
    contactPhone: "+123 456 7890",
    address: "",
  });
  const [systemId, setSystemId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await AdminSettingsLists();
        if (response?.success) {
          const { id, name, email, phone, address, image } = response.data;
          setSystemId(id);
          setSettings({
            systemLogo: image,
            systemName: name,
            contactEmail: email,
            contactPhone: phone.toString(),
            address: address,
          });
          setImages(response.data.images || []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSettings((prev) => ({ ...prev, systemLogo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const toggleImage = (imageUrl) => {
    setSelectedImages((prev) =>
      prev.includes(imageUrl) ? prev.filter((url) => url !== imageUrl) : [...prev, imageUrl]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", settings.systemName);
      formData.append("email", settings.contactEmail);
      formData.append("phone", settings.contactPhone);
      formData.append("address", settings.address);

      if (settings.systemLogo && settings.systemLogo.startsWith("data:")) {
        const logoBlob = await fetch(settings.systemLogo).then((res) => res.blob());
        formData.append("image", logoBlob, "logo.png");
      }

      selectedImages.forEach((url, index) => formData.append(`images[${index}]`, url));

      const response = await AdminSettingsUpdate(systemId, formData);
      if (response?.success) {
        toast.success("Settings updated successfully!");
        setIsEditMode(false);
      } else {
        toast.error("Failed to update settings");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error updating settings");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Toaster />
      <div className="mt-20 flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          menuLink={MenuLinks || []}
          className="fixed h-full transition-all duration-300"
        />

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          } overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100`}
        >
          <div className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2 mb-4 sm:mb-0">
                  <Building className="text-green-600" size={28} /> System Settings
                </h1>
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all ${
                    isEditMode ? "bg-gray-600 hover:bg-gray-700" : "bg-green-600 hover:bg-green-700"
                  } w-full sm:w-auto`}
                >
                  {isEditMode ? <X size={18} /> : <Edit2 size={18} />}
                  {isEditMode ? "Cancel" : "Edit"}
                </button>
              </div>

              {isEditMode ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Logo Section */}
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Image className="text-green-600" size={20} /> System Logo
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {settings.systemLogo && (
                        <img
                          src={settings.systemLogo.startsWith("data:") ? settings.systemLogo : `http://127.0.0.1:8000${settings.systemLogo}`}
                          alt="Logo"
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="w-full sm:w-auto file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-green-600 file:text-white file:border-0 hover:file:bg-green-700 transition-all"
                      />
                    </div>
                  </div>

                  {/* Images Section */}
                  {images.length > 0 && (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <Image className="text-green-600" size={20} /> Additional Images
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((image, index) => {
                          const imageUrl = `http://127.0.0.1:8000${image}`;
                          return (
                            <div key={index} onClick={() => toggleImage(imageUrl)} className="cursor-pointer">
                              <img
                                src={imageUrl}
                                alt={`Image ${index}`}
                                className={`w-full h-32 object-cover rounded-lg border-2 ${
                                  selectedImages.includes(imageUrl) ? "border-green-500" : "border-gray-200"
                                }`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Settings Form */}
                  <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">General Settings</h2>
                    {[
                      { label: "System Name", name: "systemName", icon: Building },
                      { label: "Contact Email", name: "contactEmail", icon: Mail },
                      { label: "Contact Phone", name: "contactPhone", icon: Phone },
                      { label: "Address", name: "address", icon: MapPin },
                    ].map(({ label, name, icon: Icon }) => (
                      <div key={name} className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <div className="flex items-center">
                          <Icon className="absolute left-3 text-gray-400" size={20} />
                          <input
                            name={name}
                            value={settings[name]}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Logo Display */}
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Image className="text-green-600" size={20} /> System Logo
                    </h2>
                    {settings.systemLogo ? (
                      <img
                        src={`http://127.0.0.1:8000${settings.systemLogo}`}
                        alt="Logo"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                        No Logo
                      </div>
                    )}
                  </div>

                  {/* Settings Display */}
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">General Settings</h2>
                    <div className="space-y-4">
                      {[
                        { label: "Name", value: settings.systemName, icon: Building },
                        { label: "Email", value: settings.contactEmail, icon: Mail },
                        { label: "Phone", value: settings.contactPhone, icon: Phone },
                        { label: "Address", value: settings.address, icon: MapPin },
                      ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="flex items-center gap-3">
                          <Icon className="text-green-600" size={20} />
                          <div>
                            <span className="font-medium text-gray-700">{label}:</span>{" "}
                            <span className="text-gray-600">{value || "Not Set"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Images Display */}
                  {images.length > 0 && (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <Image className="text-green-600" size={20} /> Additional Images
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <img
                            key={index}
                            src={`http://127.0.0.1:8000${image}`}
                            alt={`Image ${index}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;