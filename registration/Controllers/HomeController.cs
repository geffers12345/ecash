using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace registration.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult logout()
        {
            Helpers.Log.create(Auth.Auth.user().ID,
                Auth.Auth.user().Firstname + " " + Auth.Auth.user().Lastname + " has logged out.", DateTime.Now.ToString());

            FormsAuthentication.SignOut();

            return Redirect("/");
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}