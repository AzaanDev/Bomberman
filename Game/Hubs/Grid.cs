enum CellType
{
    Empty,
    Wall,
    BreakableWall,
    Bomb,
    Player,
    Enemy
}

class Grid
{
    private int width;
    private int height;
    private CellType[,] grid;

    public Grid(int width, int height)
    {
        this.width = width;
        this.height = height;
        grid = new CellType[width, height];
    }

    public void SetCellType(int x, int y, CellType cellType)
    {
        if (x >= 0 && x < width && y >= 0 && y < height)
        {
            grid[x, y] = cellType;
        }
        else
        {
            throw new ArgumentOutOfRangeException("Coordinates are out of range.");
        }
    }

    public CellType GetCellType(int x, int y)
    {
        if (x >= 0 && x < width && y >= 0 && y < height)
        {
            return grid[x, y];
        }
        else
        {
            throw new ArgumentOutOfRangeException("Coordinates are out of range.");
        }
    }
}