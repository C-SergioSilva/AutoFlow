using Microsoft.AspNetCore.Mvc;

namespace AutoFlow.UI.Controllers
{
    public class ClienteController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
