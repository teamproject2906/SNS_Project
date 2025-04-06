import { useState } from "react";
import { Switch, Listbox } from "@headlessui/react";
import { Lock, Eye, MessageSquare, UserX, Globe, Bell, Shield, Settings } from "lucide-react";

const tabs = ["Setting"];
const languages = ["English", "VietNam", "Spanish", "French", "German"];

const settingsOptions = [
  { name: "Private Profile", icon: <Lock size={20} />, toggle: true },
  { name: "Mentions", icon: <MessageSquare size={20} />, value: "Everyone" },
  { name: "Online Status", icon: <Eye size={20} />, value: "No one" },
  { name: "Blocked Profiles", icon: <UserX size={20} />, external: true },
  { name: "Hide Like and Share Counts", icon: <Eye size={20} />, external: true },
  { name: "Change Password", icon: <Shield size={20} />, external: true },
  { name: "Two-Factor Authentication", icon: <Shield size={20} />, toggle: true },
  { name: "Notification Preferences", icon: <Bell size={20} />, external: true },
  { name: "Language", icon: <Globe size={20} />, dropdown: true },
  { name: "App Theme", icon: <Settings size={20} />, value: "Light" },
];

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState("Privacy");
  const [privateProfile, setPrivateProfile] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-3 text-center font-semibold transition duration-300 ${
                selectedTab === tab ? "border-b-2 border-black text-black" : "text-gray-500"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="mt-6">
          {settingsOptions.map((option, index) => (
            <div key={index} className="flex items-center justify-between py-4 border-b">
              <div className="flex items-center space-x-3">
                {option.icon}
                <span className="text-gray-700 font-medium">{option.name}</span>
              </div>
              {option.toggle ? (
                <Switch
                  checked={option.name === "Private Profile" ? privateProfile : twoFactor}
                  onChange={option.name === "Private Profile" ? setPrivateProfile : setTwoFactor}
                  className={`$ {
                    (option.name === "Private Profile" ? privateProfile : twoFactor) ? "bg-black" : "bg-gray-300"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition`}
                >
                  <span
                    className={`$ {
                      (option.name === "Private Profile" ? privateProfile : twoFactor) ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                  />
                </Switch>
              ) : option.value ? (
                <span className="text-gray-500">{option.value}</span>
              ) : option.external ? (
                <button className="text-blue-500 hover:underline">Manage</button>
              ) : option.dropdown ? (
                <Listbox value={selectedLanguage} onChange={setSelectedLanguage}>
                  <div className="relative">
                    <Listbox.Button className="border rounded-md py-1 px-3 bg-gray-100">{selectedLanguage}</Listbox.Button>
                    <Listbox.Options className="absolute mt-2 w-full bg-white shadow-md rounded-md border">
                      {languages.map((lang, idx) => (
                        <Listbox.Option key={idx} value={lang} className="p-2 hover:bg-gray-100 cursor-pointer">
                          {lang}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}