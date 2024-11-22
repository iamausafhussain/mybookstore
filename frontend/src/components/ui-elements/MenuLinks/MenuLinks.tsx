import { MenuLinksProps } from "./interfaces.tsx";
import { SubLinksBox } from "./LinkSubItems.tsx";
import React from 'react'

export const MenuLinks = ({ menuLinks }: MenuLinksProps) => {
  return (
    <ul className="flex px-1 lg:px-4">
      {menuLinks.map((link) => (
        <div className="relative group" key={link.name}>
          <li className="p-2 font-semibold rounded-lg cursor-pointer lg:px-4 text-gray-800 hover:text-gray-800 dark:hover:text-slate-300 hover:bg-purple-300 dark:hover:bg-slate-800">
            {link.name}
          </li>
          <div className="hidden group-hover:block z-50">
            <SubLinksBox
              subLinks={link.subLinks}
              extraLinks={link.extraLinks}
            />
          </div>
        </div>
      ))}
    </ul>
  );
};
