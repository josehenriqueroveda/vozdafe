import useSWR from "swr";
import "app/globals.css";

import { LuDatabase } from "react-icons/lu";
import { LuArrowUpDown } from "react-icons/lu";
import { LuGitBranch } from "react-icons/lu";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <main className="min-h-screen bg-[#f8fafc] p-6 md:p-8 lg:p-12">
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          Status
        </h1>
        <UpdatedAt />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DatabaseStatus />
          <DatabaseVersion />
        </div>
      </main>
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 10000,
  });

  let updatedAtText = "Loading...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <div className="mb-4 mt-2">
      <span className="text-sm text-gray-600">
        <strong>Last updated: </strong> {updatedAtText}
      </span>
    </div>
  );
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 10000,
  });

  let databaseStatusText = "Loading...";
  let statusColor = "bg-[#ef4444]";

  if (!isLoading && data) {
    databaseStatusText = data.dependencies.database ? "Up" : "Down";
    statusColor = "bg-[#22c55e]";
  }

  return (
    <div
      className="
      transform
      rounded-lg
      bg-white
      p-6
      shadow-sm
      transition
      duration-200
      hover:shadow-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LuDatabase className="h-6 w-6 text-gray-600" />
          <h2 className="text-lg font-medium text-gray-900">Database Status</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
          <span className="text-sm font-medium text-gray-600">
            {databaseStatusText}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LuArrowUpDown className="h-4 w-4 text-gray-600" />
        <span className="text-sm text-gray-600">
          <a href="https://neonstatus.com/" target="_blank">
            Click to check <strong>Neon</strong> status
          </a>
        </span>
      </div>
    </div>
  );
}

function DatabaseVersion() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 10000,
  });

  let databaseVersionText = "...";

  if (!isLoading && data) {
    databaseVersionText = data.dependencies.database.version;
  }

  return (
    <div className="transform rounded-lg bg-white p-6 shadow-sm transition duration-200 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LuGitBranch className="h-6 w-6 text-gray-600" />
          <h2 className="text-lg font-medium text-gray-900">
            Database Version
          </h2>
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">
        {databaseVersionText}
      </p>
      <p className="mt-1 text-sm text-gray-500">PostgreSQL</p>
    </div>
  );
}
