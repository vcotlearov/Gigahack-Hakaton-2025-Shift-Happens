using FarmProfit.API.Contexts;
using FarmProfit.API.Extensions;
using FarmProfit.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FarmProfit.API.Controllers;

[ApiController]
[Route("api/parcel")]
public class ParcelController(AppDbContext db, ILogger<ParcelController> logger) : ControllerBase
{
	[HttpGet]
	[Authorize]
	public async Task<IActionResult> GetParcelListForOrganization(Guid orgId)
	{
		try
		{
			var parcelList = db.Parcels.Where(p => p.Id == orgId);
			return await Task.FromResult<IActionResult>(Ok(parcelList));
		}
		catch (Exception ex)
		{
			logger.LogError($"Error during parcel retrieval: {ex.Message}");
			return BadRequest(ex.Message);
		}
	}

	[HttpPost]
	[Authorize]
	public async Task<IActionResult> CreateParcel(Parcel parcel)
	{
		try
		{
			var employee = HttpContext.GetEmployee();
			if (employee is null) return BadRequest();

			var entity = await db.Parcels.AddAsync(parcel);
			await db.SaveChangesAsync();
			return Ok(entity.Entity);
		}
		catch (Exception ex)
		{
			logger.LogError($"Error during parcel save: {ex.Message}");
			return BadRequest(ex.Message);
		}
	}

	[HttpPut]
	[Authorize]
	public async Task<IActionResult> UpdateParcel(Parcel parcel)
	{
		try
		{
			var employee = HttpContext.GetEmployee();
			if (employee is null) return BadRequest();

			var entity = db.Parcels.FirstOrDefault(u => u.Id == parcel.Id);
			if (entity is null) return BadRequest("Unknown parcel");

			entity.CadastralNumber = parcel.CadastralNumber;
			entity.LandType = parcel.LandType;
			entity.Ownership = parcel.Ownership;
			entity.Name = parcel.Name;
			entity.GeoJson = parcel.GeoJson;
			entity.Area = parcel.Area;

			var updatedEntity = db.Parcels.Update(entity);

			await db.SaveChangesAsync();
			return Ok(updatedEntity);
		}
		catch (Exception ex)
		{
			logger.LogError($"Error during parcel update: {ex.Message}");
			return BadRequest(ex.Message);
		}
	}
}
