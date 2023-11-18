// Header.js
import { ConnectButton } from "./ConnectButton";
import {
  Button,
  MoonSVG,
  SunSVG,
  Typography
} from '@ensdomains/thorin'

export const Header = ({ theme, setTheme }: { theme: string, setTheme: (newTheme: string) => void}) => {
  return (
    <header className="fixed w-full top-0 border-b-2 h-16 border-slate-300">
      <div className="h-full flex justify-end items-center gap-4 w-full">
        <div className="ml-4 mr-auto">
          <Typography>Grow or Gamble</Typography>
        </div>
        <div className="ml-auto mr-4 flex">
          {theme === "light" ? (
            <Button colorStyle='transparent' shape="square" className='ml-auto' onClick={() => setTheme("dark")}>
              <MoonSVG />
            </Button>
          ) : (
            <Button colorStyle='transparent' shape="square" className='ml-auto' onClick={() => setTheme("light")}>
              <SunSVG />
            </Button>
          )}
        </div>
        <ConnectButton />    
      </div>
    </header>
  );
};

export default Header;
