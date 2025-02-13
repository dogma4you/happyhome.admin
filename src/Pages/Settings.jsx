import { useEffect, useState } from "react";
import api from "../api/api";
import useSettingsStore from "../store/useSettingsStore";
import Input from "../Components/Input";

export default function Settings() {
  const { setSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState({
    paymentFee: 0,
    contractFee: 0,
    singleCreditPrice: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, [setSettings]);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/admin/settings");
      setSettings(response.data.data);
      setLocalSettings(response.data.data);
    } catch (err) {
      setError("Failed to fetch settings");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalSettings((prev) => ({
      ...prev,
      [name]: value ? parseFloat(value) : 0, 
    }));
  };

  const handleSave = async () => {
    try {
      await api.put("/admin/settings", localSettings);
      setSettings(localSettings);
    } catch (err) {
      setError("Failed to update settings");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Settings</h2>

      {/* <Input
        label="Payment Fee"
        type="text"
        name="paymentFee"
        value={localSettings.paymentFee?.toString()}
        onChange={handleChange}
        placeholder="Enter Payment Fee"
      />
      <Input
        label="Contract Fee"
        type="text"
        name="contractFee"
        value={localSettings.contractFee?.toString()}
        onChange={handleChange}
        placeholder="Enter Contract Fee"
      /> */}
      <Input
        label="Single Credit Price"
        type="text"
        name="singleCreditPrice"
        value={localSettings.singleCreditPrice?.toString()}
        onChange={handleChange}
        placeholder="Enter Single Credit Price"
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleSave}
      >
        Save Settings
      </button>
    </div>
  );
}
