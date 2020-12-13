using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace registration.Controllers
{
    public class DashboardController : Controller
    {
        public static List<Helpers.Ability> ModulePermissions { get; set; }

        // GET: Dashboard
        public ActionResult Index()
        {
            ModulePermissions = Models.Accounts.permissionFor("Dashboard");

            return View();
        }
    }
}