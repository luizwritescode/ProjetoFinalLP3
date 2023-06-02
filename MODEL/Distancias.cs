using System;
using System.Collections.Generic;

namespace MODEL;

public partial class Distancias
{
    public int Id { get; set; }

    public string MunicipioOrigem { get; set; } = null!;

    public string MunicipioDestino { get; set; } = null!;

    public int Distancia { get; set; }
}
