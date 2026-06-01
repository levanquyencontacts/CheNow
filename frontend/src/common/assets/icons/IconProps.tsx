import { Override } from '@/common/shared';
import { RefObject, SVGProps } from 'react';


type IconProps = Override<
  SVGProps<SVGSVGElement>,
  {
    title?: string;
    size?: number;
    color?: string;
    className?: string;
    animateOnHover?: boolean;
    ref?: RefObject<SVGSVGElement>;
  }
>;

export type { IconProps };
