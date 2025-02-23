"use client";

import * as React from "react";

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{
  value: string;
  setValue: (value: string) => void;
}>({ value: "", setValue: () => {} });

export function Tabs({ defaultValue, children, className = "" }: TabsProps) {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div className={`flex space-x-2 mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = "" }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  const isActive = context.value === value;

  return (
    <button
      className={`px-4 py-2 rounded-lg ${
        isActive 
          ? "bg-indigo-600 text-white" 
          : "bg-gray-100 hover:bg-gray-200"
      } ${className}`}
      onClick={() => context.setValue(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = "" }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  
  if (context.value !== value) return null;
  
  return (
    <div className={className}>
      {children}
    </div>
  );
}