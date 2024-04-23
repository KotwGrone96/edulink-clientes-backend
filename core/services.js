import AreaService from "../services/AreaService.js";
import UserService from "../services/UserService.js";
import CostumerService from "../services/CostumerService.js";
import SaleService from "../services/SaleService.js";
import CostCenterService from "../services/CostCenterService.js";
import UserRolesService from "../services/UserRolesService.js";
import UserCostumerService from "../services/UserCostumerService.js";
import ContactInfoService from "../services/ContactInfoService.js";
import ProductSelledService from "../services/ProductSelledService.js";

const areaService = new AreaService()
const userService = new UserService()
const costumerService = new CostumerService()
const saleService = new SaleService()
const costCenterService = new CostCenterService()
const userRolesService = new UserRolesService()
const userCostumerService = new UserCostumerService()
const contactInfoService = new ContactInfoService()
const productSelledService = new ProductSelledService()

export {
    areaService,
    userService,
    costumerService,
    saleService,
    costCenterService,
    userRolesService,
    userCostumerService,
    contactInfoService,
    productSelledService
}