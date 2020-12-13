using registration.Helpers;
using registration.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace registration.Controllers
{
    public class AuditsController : Controller
    {
        DatabaseContext context = new DatabaseContext();
        // GET: Audits
        public static List<Helpers.Ability> ModulePermissions { get; set; }

        // GET: Dashboard
        public ActionResult Index()
        {
            ModulePermissions = Models.Accounts.permissionFor("Audits");
            return View();
        }

        [HttpPost]
        public JsonResult get()
        {
            List<Audits> items = new List<Audits>();

            items = context.Audits.ToList();

            return Json(items, JsonRequestBehavior.AllowGet);
        }
    }
}