using registration.Helpers;
using registration.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace registration.Controllers
{
    public class RolesController : Controller
    {
        DatabaseContext context = new DatabaseContext();
        // GET: Role
        public static List<Helpers.Ability> ModulePermissions { get; set; }

        // GET: Dashboard
        public ActionResult Index()
        {
            ModulePermissions = Models.Accounts.permissionFor("Roles");
            if (!Auth.Auth.Check())
            {
                return Redirect("/");
            }

            return View();
        }

        [HttpPost]
        public JsonResult get()
        {
            List<Roles> items = new List<Roles>();

            items = context.Roles.ToList();

            return Json(items, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult find(int id)
        {
            List<Roles> items = new List<Roles>();

            items = context.Roles.Where(item => item.Id == id).ToList();

            return Json(items, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult create(Roles items)
        {
            Roles roles = context.Roles.FirstOrDefault(item => item.Id == items.Id);

            var autoID = 0;

            if (roles == null)
            {
                context.Roles.Add(items);

                context.SaveChanges();

                autoID = items.Id;

                Helpers.Log.create(Auth.Auth.user().ID,
                Auth.Auth.user().Firstname + " " + Auth.Auth.user().Lastname + " has added a new user role: " + items.Role + "", items.DateCreated);

            } else {
                delete_role_permissions(items.Id);

                roles.Role = items.Role;
                roles.Description = items.Description;
                roles.DateUpdated = items.DateUpdated;

                context.SaveChanges();

                autoID = items.Id;

                Helpers.Log.create(Auth.Auth.user().ID,
                Auth.Auth.user().Firstname + " " + Auth.Auth.user().Lastname + " has updated a user role: " + items.Role + "", items.DateCreated);
            }

            return Json(new { autoId = autoID, JsonRequestBehavior.AllowGet });
        }

        [HttpPost]
        public ActionResult change_status(Roles items)
        {
            Roles roles = context.Roles.FirstOrDefault(item => item.Id == items.Id);

            string message = "0";

            roles.DateDeleted = items.DateDeleted;

            context.SaveChanges();

            Helpers.Log.create(Auth.Auth.user().ID,
                Auth.Auth.user().Firstname + " " + Auth.Auth.user().Lastname + " has updated a status to a user role: " + items.Role + "", DateTime.Now.ToString());

            message = "1";

            return Json(new { Message = message, JsonRequestBehavior.AllowGet });
        }

        [HttpPost]
        public ActionResult create_role_permissions(RolePermissions items)
        {
            string message = "0";

            context.RolePermissions.Add(items);

            context.SaveChanges();

            return Json(new { Message = message, JsonRequestBehavior.AllowGet });
        }

        public void delete_role_permissions(int id) {

            context.RolePermissions.RemoveRange(context.RolePermissions.Where(item => item.RoleId == id));
            context.SaveChanges();
        }

        [HttpPost]
        public JsonResult find_role_permissions(int id)
        {
            List<RolePermissions> items = new List<RolePermissions>();

            items = context.RolePermissions.Where(item => item.RoleId == id).ToList();

            return Json(items, JsonRequestBehavior.AllowGet);
        }
    }
}