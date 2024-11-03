'use client';

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

interface ColorContextType {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
}

const defaultColorContext: ColorContextType = {
  color: 'zinc',
  setColor: () => {},
};

const ColorContext = createContext<ColorContextType>(defaultColorContext);

export const useColor = () => {
  return useContext(ColorContext) ?? defaultColorContext;
};

const DEFAULT_COLOR = 'zinc';

const getColorFromLocalStorage = (defaultColor: string = DEFAULT_COLOR) => {
  try {
    return localStorage.getItem('color') ?? defaultColor;
  } catch {
    return defaultColor;
  }
};

interface ColorProviderProps {
  children: React.ReactNode;
  defaultColor?: string;
}

export const ColorProvider = ({ children, defaultColor }: ColorProviderProps) => {
  const [color, setColor] = useState<string>(getColorFromLocalStorage(defaultColor));

  useEffect(() => {
    setColor(getColorFromLocalStorage());
  }, [defaultColor]);

  useEffect(() => {
    localStorage.setItem('color', color);
    document.documentElement.setAttribute('data-color-mode', color);
  }, [color]);

  return <ColorContext.Provider value={{ color, setColor }}>{children}</ColorContext.Provider>;
};
