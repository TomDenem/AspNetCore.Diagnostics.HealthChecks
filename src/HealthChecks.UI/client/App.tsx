import React, { FunctionComponent, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AsideMenu } from './components/AsideMenu';
import WhiteGearIcon from '../assets/svg/white-gear.svg';
import WhiteHeartIcon from '../assets/svg/heart-check.svg';
import WhiteLogoutIcon from '../assets/svg/white-logout.svg';
import { UISettings } from './config/UISettings';
import Routes from './routes/Routes';
import fetchers from './api/fetchers';
import { AlertPanel } from './components/AlertPanel';
import { useQuery } from 'react-query';
import { useAuth, hasAuthParams } from "react-oidc-context";

interface AppProps {
    uiSettings: UISettings;
}

const App: FunctionComponent<AppProps> = ({ uiSettings }) => {
  const [asidemenuOpened, setAsideMenu] = useState<boolean>(uiSettings.asideMenuOpened);
  const { data: apiSettings, isError } = useQuery("uiApiSettings", fetchers.getUIApiSettings, { retry: 1 });
  const auth = useAuth();
  const [hasTriedSignin, setHasTriedSignin] = React.useState(false);
  // automatically sign-in
  React.useEffect(() => {
    if (!hasAuthParams() && auth.settings.authority &&
      !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading &&
      !hasTriedSignin
    ) {
      auth.signinSilent();
      setHasTriedSignin(true);
    }
  }, [auth, hasTriedSignin]);

  const toggleMenu = () => {
      setAsideMenu(!asidemenuOpened);
  };

  if (isError) {
      return <AlertPanel message="Error retrieving UI api settings from endpoint" />
  }

  if (auth.isLoading) {
    if (!apiSettings) return null;
    return (
      <main id="outer-container">
        <section className="hc-section-router">
          <Routes apiSettings={apiSettings} />
        </section>
      </main>
    );
  }

  if (auth.isAuthenticated) {
    if (!apiSettings) return null;
    return (
      <main id="outer-container">
        <AsideMenu
          isOpen={asidemenuOpened}
          onClick={() => toggleMenu()}>
          <NavLink
            to="/healthchecks"
            className="hc-aside-menu__item"
            activeClassName="hc-aside-menu__item--active"
          >
            <img alt="icon heart check" className="hc-menu-icon" src={WhiteHeartIcon} />
            <span>Health Checks</span>
          </NavLink>
          <NavLink
            to="/webhooks"
            className="hc-aside-menu__item"
            activeClassName="hc-aside-menu__item--active"
          >
            <img alt="icon gear" className="hc-menu-icon" src={WhiteGearIcon} />
            <span>Webhooks</span>
          </NavLink>
          <button onClick={() => void auth.signoutSilent()} type="button" className="hc-aside-menu__item">
            <img alt="icon gear" className="hc-menu-icon" src={WhiteLogoutIcon} />
            <span>Log out</span>
          </button>
        </AsideMenu>
        <section className="hc-section-router">
          <Routes apiSettings={apiSettings} />
        </section>
      </main>
    );
  }
  else {
    if (!apiSettings) return null;
    return (
      <main id="outer-container">
        <section className="hc-section-router">
          <Routes apiSettings={apiSettings} />
        </section>
      </main>
    );
  }
}

export { App };
