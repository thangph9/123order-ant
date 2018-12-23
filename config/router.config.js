export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/order/order-list' },
      {
        path: '/order',
        icon: 'form',
        name: 'order',
        routes: [
          {
            path: '/order/order-form',
            name: 'orderform',
            component: './Order/OrderForm',
          },
          {
            path: '/order/order-list',
            name: 'orderlist',
            component: './Order/OrderList',
          },
          {
            path: '/order/currency-raito',
            name: 'currency-raito',
            component: './Order/CurrencyForm',
          },
          {
            path: '/order/order-status',
            name: 'orderstatus',
            component: './Order/OrderStatus',
          },
          {
            path: '/order/order-confirm',
            name: 'orderconfirm',
            component: './Order/OrderConfirm',
          },
         {
            path: '/order/order-delivery',
            name: 'confirmdelivery',
            component: './Order/ConfirmDelivery',
          },
            {
            path: '/order/order-arrived',
            name: 'orderarrived',
            component: './Order/OrderArrived',
          },
        ],
      },
      {
        name: 'products',
        icon: 'table',
        path: '/products',
        routes:[ 
            {
                path: '/products/list',
                name: 'list',
                component: './Products/ProductLists',
            },
            {
                path: '/products/detail',
                name: 'detail',
                component: './Products/ProductDetail',
            },
            { 
                path: '/products/edit/:productid', 
                component : './Products/EditProduct'
            }, 
            {
                path: '/products/option',
                name: 'option',
                component: './Products/ProductOption',
            },
            {
                path: '/products/test_list',
                name: 'test_list',
                component: './Products/ProductCategoryList',
            },
            {
                path: '/products/test_edit/:productid',
                name: 'test_edit',
                component: './Products/ProductCategoryEdit',
            },
            {
                path: '/products/edit/:productid/:sku',
                component: './Products/ProductEditSKU',
            },
            {
                component : '404'
            }
            
            
        ]
      },
      {
          name: 'category',
          icon : 'shop',
          path: '/category',
          routes:[
             {  
                path: '/category/',
                redirect: '/category/list',
             },
             {
                path: '/category/list',
                name: 'index',
                component: './Category/',
             },
             {
                path: '/category/new',
                name: 'new',
                component: './Category/CategoryForm',
             },
              {
                path: '/category/edit/:nodeid',
                component: './Category/EditForm',
             },
          ]
      },    
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
              
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
          {
            path: '/account/list',
            name: 'list',
            component: './Account/List/List',
            routes: [
              {
                path: '/account/list',
                redirect: '/account/list/list',
              },
              {
                path: '/account/list/list',
                component: './Account/List/List',
              },
            ],
          },
             
        ],
      }, 
      {
            name: 'blog',
            icon: 'table',
            path: '/blogs',
            routes: [
                {
                    path: '/blogs',
                    redirect: '/blogs/list',
                  },
                  {
                    path: '/blogs/list',
                    name: 'list' ,
                    component: './Blogs/ListBlog',
                  },
                  {
                    path: '/blogs/add',
                    name: 'add' ,
                    component: './Blogs/Add',
                  },
                  {
                    path: '/blogs/edit/:artid',
                    component: './Blogs/Edit',
                  },
                  {
                    component: '404',
                  },
            ]
        },
      {
        component: '404',
      },
      
    ],
  },
];
