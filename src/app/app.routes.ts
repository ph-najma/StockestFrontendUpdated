import { Routes } from '@angular/router';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { OtpComponent } from './user/otp/otp.component';
import { HomeComponent } from './user/home/home.component';
import { ForgotPassComponent } from './user/forgot-pass/forgot-pass.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminUserListComponent } from './admin/admin-user-list/admin-user-list.component';
import { authGuard } from './auth.guard';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { nonautheticatedGuard } from './nonautheticated.guard';
import { SubAdminLoginComponent } from './admin/sub-admin-login/sub-admin-login.component';
import { SubLoginComponent } from './user/sub-login/sub-login.component';
import { UserStockListComponent } from './user/user-stock-list/user-stock-list.component';
import { OrderManagementComponent } from './admin/order-management/order-management.component';
import { LimitOrdersComponent } from './admin/limit-orders/limit-orders.component';
import { MarketOrdersComponent } from './admin/market-orders/market-orders.component';
import { StopOrdersComponent } from './admin/stop-orders/stop-orders.component';
import { MatchedOrdersComponent } from './admin/matched-orders/matched-orders.component';
import { ViewDetailsComponent } from './admin/view-details/view-details.component';
import { ModernSerachBarComponent } from './modern-serach-bar/modern-serach-bar.component';
import { PortfolioComponent } from './user/portfolio/portfolio.component';
import { TransactionHistoryComponent } from './user/transaction-history/transaction-history.component';
import { StocklistComponent } from './admin/stocklist/stocklist.component';
import { TransactionsComponent } from './admin/transactions/transactions.component';
import { TransMainComponent } from './admin/trans-main/trans-main.component';
import { PortfolioAdminComponent } from './admin/portfolio-admin/portfolio-admin.component';
import { LimitAdminComponent } from './admin/limit-admin/limit-admin.component';
import { PromotionComponent } from './admin/promotion/promotion.component';
import { WatchlistComponent } from './user/watchlist/watchlist.component';
import { TradingViewComponent } from './trading-view/trading-view.component';
import { AddMoneyComponent } from './user/add-money/add-money.component';
import { OrderListingComponent } from './user/order-listing/order-listing.component';
import { TradeDiaryComponent } from './user/trade-diary/trade-diary.component';
import { CreateSessionComponent } from './admin/create-session/create-session.component';
import { SessionComponent } from './admin/session/session.component';
import { EditSessionComponent } from './admin/edit-session/edit-session.component';
import { TardingCourseComponent } from './user/tarding-course/tarding-course.component';
import { StockDetailsComponent } from './user/stock-details/stock-details.component';

import { AskAiComponent } from './ask-ai/ask-ai.component';
import { InstructorHomeComponent } from './user/instructor-home/instructor-home.component';
import { InstructorLoginComponent } from './user/instructor-login/instructor-login.component';
import { VideoCallComponent } from './video-call/video-call.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [nonautheticatedGuard],
  },
  //User Routes
  {
    path: 'login',
    component: SubLoginComponent,
    canActivate: [nonautheticatedGuard],
  },
  {
    path: 'otp',
    component: OtpComponent,
    canActivate: [nonautheticatedGuard],
  },
  {
    path: 'forgotPassword',
    component: ForgotPassComponent,
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'userProfile',
    component: UserProfileComponent,
    canActivate: [authGuard],
  },

  {
    path: 'stocks',
    component: UserStockListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
    canActivate: [authGuard],
  },
  {
    path: 'transactionhistory',
    component: TransactionHistoryComponent,
    canActivate: [authGuard],
  },
  { path: 'ai', component: AskAiComponent, canActivate: [authGuard] },
  {
    path: 'stockdetails/:symbol',
    component: StockDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'courses',
    component: TardingCourseComponent,
    canActivate: [authGuard],
  },
  {
    path: 'searchbar',
    component: ModernSerachBarComponent,
    canActivate: [authGuard],
  },
  {
    path: 'watchlist',
    component: WatchlistComponent,
    canActivate: [authGuard],
  },
  {
    path: 'tradingview',
    component: TradingViewComponent,
    canActivate: [authGuard],
  },
  {
    path: 'addmoney',
    component: AddMoneyComponent,
    canActivate: [authGuard],
  },
  {
    path: 'myOrders',
    component: OrderListingComponent,
    canActivate: [authGuard],
  },

  {
    path: 'tradediary',
    component: TradeDiaryComponent,
    canActivate: [authGuard],
  },
  //Admin Routes

  {
    path: 'adminLogin',
    component: SubAdminLoginComponent,
  },

  {
    path: 'adminHome',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'userList',
    component: AdminUserListComponent,
    canActivate: [authGuard],
  },

  {
    path: 'ordermanagement',
    component: OrderManagementComponent,
    canActivate: [authGuard],
  },
  {
    path: 'limitorders',
    component: LimitOrdersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'marketorders',
    component: MarketOrdersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'stoporders',
    component: StopOrdersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'matchorders',
    component: MatchedOrdersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'viewdetails/:id',
    component: ViewDetailsComponent,
    canActivate: [authGuard],
  },

  { path: 'list', component: StocklistComponent, canActivate: [authGuard] },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'allTransactions',
    component: TransMainComponent,
    canActivate: [authGuard],
  },
  {
    path: 'portfolioAdmin/:userId',
    component: PortfolioAdminComponent,
    canActivate: [authGuard],
  },
  { path: 'limit', component: LimitAdminComponent, canActivate: [authGuard] },
  {
    path: 'promotions',
    component: PromotionComponent,
    canActivate: [authGuard],
  },

  {
    path: 'createSession',
    component: CreateSessionComponent,
    canActivate: [authGuard],
  },
  {
    path: 'sessions',
    component: SessionComponent,
    canActivate: [authGuard],
  },
  {
    path: 'editSession/:sessionId',
    component: EditSessionComponent,
    canActivate: [authGuard],
  },
  {
    path: 'instructorLogin',
    component: InstructorLoginComponent,
    canActivate: [nonautheticatedGuard],
  },
  {
    path: 'instructorhome',
    component: InstructorHomeComponent,
    canActivate: [authGuard],
  },
  { path: 'video-call', component: VideoCallComponent },
];
