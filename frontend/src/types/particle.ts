/**
 * Particle types and classes for the collision simulation.
 */

export interface ParticleState {
  id: string;
  x: number;         // Position on canvas
  y: number;         // Y position (for 2D visualization)
  velocity: number;  // 1D velocity (positive = rightward)
  mass: number;      // Mass in kg
  radius: number;    // Visual radius (proportional to mass)
  color: string;     // Particle color
}

export class Particle implements ParticleState {
  public id: string;
  public x: number;
  public y: number;
  public velocity: number;
  public mass: number;
  public radius: number;
  public color: string;

  constructor(
    id: string,
    x: number,
    y: number,
    velocity: number = 0,
    mass: number = 1,
    color: string = '#ff6b6b'
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.mass = mass;
    this.color = color;
    // Radius proportional to mass (with min/max bounds)
    this.radius = Math.max(10, Math.min(50, 10 + mass * 5));
  }

  /**
   * Update particle position based on velocity and time delta.
   */
  updatePosition(deltaTime: number): void {
    // Convert deltaTime from milliseconds to seconds
    const deltaSeconds = deltaTime / 1000;
    // Update position: x = x + v * t
    this.x += this.velocity * deltaSeconds * 100; // Scale for visual speed
  }

  /**
   * Draw the particle on canvas.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // Draw particle body
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw particle outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw velocity arrow
    if (Math.abs(this.velocity) > 0.1) {
      this.drawVelocityArrow(ctx);
    }
    
    ctx.restore();
  }

  /**
   * Draw velocity arrow to show direction and magnitude.
   */
  private drawVelocityArrow(ctx: CanvasRenderingContext2D): void {
    const arrowLength = Math.min(60, Math.abs(this.velocity) * 20);
    const arrowDirection = this.velocity > 0 ? 1 : -1;
    
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    
    // Arrow line
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.radius - 10);
    ctx.lineTo(this.x + arrowDirection * arrowLength, this.y - this.radius - 10);
    ctx.stroke();
    
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(this.x + arrowDirection * arrowLength, this.y - this.radius - 10);
    ctx.lineTo(this.x + arrowDirection * (arrowLength - 8), this.y - this.radius - 15);
    ctx.lineTo(this.x + arrowDirection * (arrowLength - 8), this.y - this.radius - 5);
    ctx.closePath();
    ctx.fillStyle = '#00ff00';
    ctx.fill();
  }

  /**
   * Check if point is inside particle (for drag detection).
   */
  containsPoint(x: number, y: number): boolean {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy) <= this.radius;
  }

  /**
   * Check if this particle is colliding with another particle.
   */
  isCollidingWith(other: Particle): boolean {
    const distance = Math.abs(this.x - other.x);
    return distance <= (this.radius + other.radius);
  }
} 