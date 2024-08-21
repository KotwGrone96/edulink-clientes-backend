import AreaService from "../services/AreaService.js";
import UserService from "../services/UserService.js";
import CostumerService from "../services/CostumerService.js";
import SaleService from "../services/SaleService.js";
import CostCenterService from "../services/CostCenterService.js";
import UserRolesService from "../services/UserRolesService.js";
import UserCostumerService from "../services/UserCostumerService.js";
import ContactInfoService from "../services/ContactInfoService.js";
import ProductSelledService from "../services/ProductSelledService.js";
import CostCenterApprovalsService from "../services/CostCenterApprovalsService.js";
import RouteService from "../services/RouteService.js";
import SaleHistoryService from "../services/SaleHistoryService.js";
import CostCenterHistoryService from "../services/CostCenterHistoryService.js";
import CostCenterApprovalsHistoryService from "../services/CostCenterApprovalsHistoryService.js";
import SaleTaskService from "../services/SaleTaskService.js";
import InvoiceService from "../services/InvoiceService.js";
import PaymentService from "../services/PaymentService.js"
import FinanceSectionService from "../services/FinanceSectionService.js";
import FinanceService from "../services/FinanceService.js";
import SaleCollaboratorService from "../services/SaleCollaboratorService.js"

const areaService = new AreaService()
const userService = new UserService()
const costumerService = new CostumerService()
const saleService = new SaleService()
const costCenterService = new CostCenterService()
const userRolesService = new UserRolesService()
const userCostumerService = new UserCostumerService()
const contactInfoService = new ContactInfoService()
const productSelledService = new ProductSelledService()
const costCenterApprovalsService = new CostCenterApprovalsService()
const routeService = new RouteService()
const saleHistoryService = new SaleHistoryService()
const costCenterHistoryService = new CostCenterHistoryService()
const costCenterApprovalsHistoryService = new CostCenterApprovalsHistoryService()
const saleTaskService = new SaleTaskService()
const invoiceService = new InvoiceService()
const paymentService = new PaymentService()
const financeSectionService = new FinanceSectionService()
const financeService = new FinanceService()
const saleCollaboratorService = new SaleCollaboratorService()

export {
    areaService,
    userService,
    costumerService,
    saleService,
    costCenterService,
    userRolesService,
    userCostumerService,
    contactInfoService,
    productSelledService,
    costCenterApprovalsService,
    routeService,
    saleHistoryService,
    costCenterHistoryService,
    costCenterApprovalsHistoryService,
    saleTaskService,
    invoiceService,
    paymentService,
    financeSectionService,
    financeService,
    saleCollaboratorService
}