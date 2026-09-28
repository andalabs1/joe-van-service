import type {IconType} from 'react-icons';
import {FaLine, FaWhatsapp} from 'react-icons/fa6';
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
  FiHeart,
  FiMail,
  FiMapPin,
  FiMenu,
  FiNavigation,
  FiPhone,
  FiSend,
  FiShield,
  FiStar,
  FiSunrise,
  FiSunset,
  FiUsers,
  FiX
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
export const ChevronDownIcon = decorative(FiChevronDown);
export const AnchorIcon = decorative(FiAnchor);
export const BriefcaseIcon = decorative(FiBriefcase);
export const CalendarIcon = decorative(FiCalendar);
export const CompassIcon = decorative(FiCompass);
export const HomeIcon = decorative(FiHome);
export const HeartIcon = decorative(FiHeart);
export const MailIcon = decorative(FiMail);
export const StarIcon = decorative(FiStar);
export const NavigationIcon = decorative(FiNavigation);
export const SendIcon = decorative(FiSend);
export const SunriseIcon = decorative(FiSunrise);
export const SunsetIcon = decorative(FiSunset);
export const LineIcon = decorative(FaLine);
export const WhatsappIcon = decorative(FaWhatsapp);
export const CloseIcon = decorative(FiX);
