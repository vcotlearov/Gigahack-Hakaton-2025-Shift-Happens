using System.Text.Json;
using FarmProfit.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmProfit.API.Controllers
{
	[ApiController]
	[Route("api/resources")]
	public class ResourcesController : Controller
	{
		[HttpGet("partners")]
		public async Task<IActionResult> GetPartners()
		{
			var data = @"[
  {
    ""id"": 1,
    ""name"": ""TerraHaul Logistics"",
    ""category"": ""Crops""
  },
  {
    ""id"": 2,
    ""name"": ""Greenline Supply Co."",
    ""category"": ""Organic Supplies""
  },
  {
    ""id"": 3,
    ""name"": ""Harvest Transit Partners"",
    ""category"": ""Produce Distribution""
  },
  {
    ""id"": 4,
    ""name"": ""Ridgeback Provisions"",
    ""category"": ""Livestock""
  },
  {
    ""id"": 5,
    ""name"": ""Summit Croft & Cargo"",
    ""category"": ""Seeds & Fertilizers""
  },
  {
    ""id"": 6,
    ""name"": ""Cross Valley Mercantile"",
    ""category"": ""Grain & Storage""
  },
  {
    ""id"": 7,
    ""name"": ""Cultivar Freight"",
    ""category"": ""Horticulture""
  },
  {
    ""id"": 8,
    ""name"": ""Agro-Vector Logistics"",
    ""category"": ""Farm Equipment""
  },
  {
    ""id"": 9,
    ""name"": ""Foundation Supply Group"",
    ""category"": ""Agrochemicals""
  },
  {
    ""id"": 10,
    ""name"": ""Bluefield Carriers"",
    ""category"": ""Irrigation Systems""
  }
]";
			var jsonDoc = JsonDocument.Parse(data);

			return await Task.FromResult<IActionResult>(Ok(jsonDoc.RootElement));
		}
	}
}
