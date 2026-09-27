import type {IconType} from 'react-icons';
import {
  FiAnchor,
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiChevronDown,
  FiClock,
  FiCompass,
  FiGitBranch,
  FiGlobe,
  FiHome,
  FiMapPin,
  FiMenu,
  FiMessageCircle,
  FiNavigation,
  FiPhone,
  FiSend,
  FiShield,
  FiSunrise,
  FiSunset,
  FiUsers
} from 'react-icons/fi';

function decorative(Icon: IconType): IconType {
  return function DecorativeIcon(props) {
    return <Icon aria-hidden="true" focusable="false" {...props} />;
  };
}

export const ArrowIcon = decorative(FiArrowRight);
export const PhoneIcon = decorative(FiPhone);
export const PinIcon = decorative(FiMapPin);
export const ClockIcon = decorative(FiClock);
export const UsersIcon = decorative(FiUsers);
export const RouteIcon = decorative(FiGitBranch);
export const ShieldIcon = decorative(FiShield);
export const GlobeIcon = decorative(FiGlobe);
export const MenuIcon = decorative(FiMenu);
export const MessageIcon = decorative(FiMessageCircle);
export const ChevronDownIcon = decorative(FiChevronDown);
export const AnchorIcon = decorative(FiAnchor);
export const BriefcaseIcon = decorative(FiBriefcase);
export const CalendarIcon = decorative(FiCalendar);
export const CompassIcon = decorative(FiCompass);
export const HomeIcon = decorative(FiHome);
export const NavigationIcon = decorative(FiNavigation);
export const SendIcon = decorative(FiSend);
export const SunriseIcon = decorative(FiSunrise);
export const SunsetIcon = decorative(FiSunset);
