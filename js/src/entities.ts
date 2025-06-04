export class Damagable {
  hp: number;
  maxHp: number;
  constructor(maxHp: number) {
    this.hp = maxHp;
    this.maxHp = maxHp;
  }

  inflictDamage(amount: number): number {
    const actual = Math.min(this.hp, amount);
    this.hp -= amount;
    if (this.hp < 0) this.hp = 0;
    return actual;
  }

  addHP(amount: number) {
    this.hp += amount;
    if (this.hp > this.maxHp) this.hp = this.maxHp;
  }

  destroyed(): boolean {
    return this.hp <= 0;
  }
}

export class Player extends Damagable {
  name: string;
  constructor(name: string, maxHp: number) {
    super(maxHp);
    this.name = name;
  }
}
