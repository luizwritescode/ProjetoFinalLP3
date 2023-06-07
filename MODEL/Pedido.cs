using System;
using System.Collections.Generic;

namespace MODEL;

public partial class Pedido
{
    public Pedido()
    {
        ClienteNavigation = null!;
        Status = "Aberto";
    }
    public int Id { get; set; }

    public int Cliente { get; set; }

    public string MunicipioOrigem { get; set; } = null!;

    public string MunicipioDestino { get; set; } = null!;

    public int QtdCarros { get; set; }

    public int QtdVans { get; set; }

    public double? Valor { get; set; }

    public DateTime? Data { get; set; }

    public string Status { get; set; } = null!;

    public virtual Cliente ClienteNavigation { get; set; } = null!;
}
