'use client';

import {
  createContext,
  Dispatch,
  memo,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

interface ColorContextType {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
}

const defaultColorContext: ColorContextType = {
  color: 'zinc',
  setColor: () => {},
};

const ColorContext = createContext<ColorContextType>(defaultColorContext);

const DEFAULT_COLOR = 'zinc';
const STORAGE_KEY = 'color';

export const useColor = () => {
  return useContext(ColorContext) ?? defaultColorContext;
};

const getColorFromLocalStorage = (defaultColor: string = DEFAULT_COLOR) => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? defaultColor;
  } catch {
    return defaultColor;
  }
};

const script = (defaultColor: string, storageKey: string) => {
  const el = document.documentElement;

  function updateDom() {
    const color = localStorage.getItem(storageKey) ?? defaultColor;
    el.setAttribute('data-color-mode', color);
  }

  updateDom();
};

interface ColorThemeScriptProps {
  defaultColor: string;
  storageKey: string;
  nonce: string;
}

const ColorThemeScript = memo(({ defaultColor, storageKey, nonce }: ColorThemeScriptProps) => {
  const scriptArgs = JSON.stringify([defaultColor, storageKey]).slice(1, -1);

  return (
    <script
      suppressHydrationWarning
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: `(${script.toString()})(${scriptArgs})` }}
    />
  );
});
ColorThemeScript.displayName = 'ColorThemeScript';

interface ColorProviderProps extends PropsWithChildren {
  defaultColor?: string;
  nonce: string;
}

export const ColorProvider = ({ children, defaultColor, nonce }: ColorProviderProps) => {
  const [color, setColor] = useState<string>(getColorFromLocalStorage(defaultColor));

  useEffect(() => {
    setColor(getColorFromLocalStorage());
  }, [defaultColor]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, color);
    document.documentElement.setAttribute('data-color-mode', color);
  }, [color]);

  return (
    <ColorContext.Provider value={{ color, setColor }}>
      <ColorThemeScript defaultColor={DEFAULT_COLOR} storageKey={STORAGE_KEY} nonce={nonce} />
      {children}
    </ColorContext.Provider>
  );
};
