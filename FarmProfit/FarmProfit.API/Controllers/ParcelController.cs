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
	[HttpGet("{orgId:guid}")]
	[Authorize]
	public async Task<IActionResult> GetParcelListForOrganization(Guid orgId)
	{
		try
		{
			var parcelList = await db.Parcels
				.Where(p => p.BusinessId == orgId)
				.Select(x=> ConvertParcelToDto(x))
				.ToListAsync();
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
	public async Task<IActionResult> CreateParcel(ParcelDto parcel)
	{
		try
		{
			var employee = HttpContext.GetEmployee();
			if (employee is null) return BadRequest();

			var entity = await db.Parcels.AddAsync(ConvertDtoToParcel(parcel));
			await db.SaveChangesAsync();
			return Ok(ConvertParcelToDto(entity.Entity));
		}
		catch (Exception ex)
		{
			logger.LogError($"Error during parcel save: {ex.Message}");
			return BadRequest(ex.Message);
		}
	}

	[HttpPut]
	[Authorize]
	public async Task<IActionResult> UpdateParcel(ParcelDto parcel)
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
			return Ok(ConvertParcelToDto(updatedEntity.Entity));
		}
		catch (Exception ex)
		{
			logger.LogError($"Error during parcel update: {ex.Message}");
			return BadRequest(ex.Message);
		}
	}

	private static ParcelDto ConvertParcelToDto(Parcel parcel)
	{
		return new ParcelDto
		{
			Id = parcel.Id,
			BusinessId = parcel.BusinessId,
			Area = parcel.Area,
			CadastralNumber = parcel.CadastralNumber,
			LandType = parcel.LandType,
			Name = parcel.Name,
			Ownership = parcel.Ownership,
			GeoJson = parcel.GeoJson,
		};
	}

	private static Parcel ConvertDtoToParcel(ParcelDto dto)
	{
		return new Parcel
		{
			Id = dto.Id,
			BusinessId = dto.BusinessId,
			Area = dto.Area,
			CadastralNumber = dto.CadastralNumber,
			LandType = dto.LandType,
			Name = dto.Name,
			Ownership = dto.Ownership,
			GeoJson = dto.GeoJson,
		};
	}
}
