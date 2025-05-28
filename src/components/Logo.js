import Image from 'next/image';

const Logo = () => (
  <div className="flex items-center gap-2 pt-1">
    <Image src="/logo.png" alt="MyBodyRules Logo" width={36} height={36} />
    <span className="font-bold text-2xl bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent select-none">
      MyBodyRules
    </span>
  </div>
);

export default Logo; 