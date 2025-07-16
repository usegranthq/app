import * as React from 'react';
import { SVGProps } from 'react';

const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={256} height={256} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width={256} height={256} rx={8} fill="black" />
    <path d="M64 53.3334V112V170.667" stroke="white" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M128 53.3334V117.333" stroke="white" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M192 53V202.333" stroke="white" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export default LogoIcon;
