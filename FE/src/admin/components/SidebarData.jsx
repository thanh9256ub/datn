import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

export const SidebarData = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <AiIcons.AiFillHome />,
    },
    {
        title: 'Quản lý khách hàng',
        path: '/users',
        icon: <IoIcons.IoMdPeople />,
    },
    {
        title: 'Cài đặt',
        path: '/settings',
        icon: <IoIcons.IoIosSettings />,
    },
    {
        title: 'Sản phẩm',
        path: '#',  // Không có đường dẫn vì đây chỉ là tiêu đề
        icon: <FaIcons.FaCartPlus />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subNav: [
            {
                title: 'Quản lý sản phẩm',
                path: '/products',
                icon: <IoIcons.IoMdListBox />,
            },
            {
                title: 'Thêm sản phẩm',
                path: '/add-product',
                icon: <FaIcons.FaPlusCircle />,
            }
        ]
    },
    {
        title: 'Team',
        path: '/team',
        icon: <IoIcons.IoMdPeople />,
    },
    {
        title: 'Messages',
        path: '/messages',
        icon: <FaIcons.FaEnvelopeOpenText />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subNav: [
            {
                title: 'Message 1',
                path: '/messages/message1',
                icon: <IoIcons.IoIosPaper />,
            },
            {
                title: 'Message 2',
                path: '/messages/message2',
                icon: <IoIcons.IoIosPaper />,
            }
        ]
    },
    {
        title: 'Support',
        path: '/support',
        icon: <IoIcons.IoMdHelpCircle />,
    }
];
