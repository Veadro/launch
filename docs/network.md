# Network Protocol

LaunchServerJS communicates using JSON encoded messages. Each message includes a
`type` field which replaces the numeric message identifiers used in the legacy
Java implementation. The protocol currently defines the following messages:

## MessageType

```ts
enum MessageType {
  AUTHORISE = 'authorise',
  LOCATION_UPDATE = 'locationUpdate',
  KEEP_ALIVE = 'keepAlive',
}
```

## BaseMessage
```ts
interface BaseMessage {
  type: MessageType;
}
```

## AuthoriseMessage
```ts
interface AuthoriseMessage extends BaseMessage {
  type: MessageType.AUTHORISE;
  deviceId: string;
  version: string;
}
```
Sent by a client when connecting to the server. The server verifies the device
and game version before allowing further communication.

Example:

```json
{ "type": "authorise", "deviceId": "abc", "version": "1.0.0" }
```

## LocationUpdateMessage
```ts
interface LocationUpdateMessage extends BaseMessage {
  type: MessageType.LOCATION_UPDATE;
  latitude: number;
  longitude: number;
}
```
Periodic location update from the client.

Example:

```json
{ "type": "locationUpdate", "latitude": 51.5, "longitude": -0.1 }
```

## KeepAliveMessage
```ts
interface KeepAliveMessage extends BaseMessage {
  type: MessageType.KEEP_ALIVE;
}
```
Used when no other data needs to be sent to maintain the connection.

Example:

```json
{ "type": "keepAlive" }
```

## AuthorisedMessage

```ts
interface AuthorisedMessage extends BaseMessage {
  type: 'authorised';
}
```
Sent by the server in response to a successful `AuthoriseMessage`.

Example:

```json
{ "type": "authorised" }
```

## Serialisation

Messages are encoded and decoded with the helper functions provided in
`src/network/protocol.ts`:

```ts
serializeMessage(message: LaunchMessage): string
parseMessage(json: string): LaunchMessage
```

These convert between TypeScript objects and their JSON string representation.


## Legacy Command Reference
The original Java server defines many numeric message identifiers in `LaunchGame/src/launch/comm/LaunchSession.java`. These are listed below to help map legacy features to the new JSON protocol.

| ID | Name | Description |
|---|---|---|
| 0 | `Authorise` | Request to authorise, using encrypted device ID. |
| 1 | `UserData` | User data. Admin's eyes only. |
| 2 | `PermBanData` | Player is permanently banned, with reason. |
| 3 | `BanData` | Player is banned, with duration and reason. |
| 4 | `Registration` | Account registration request details. |
| 5 | `GameSnapshot` | A new snapshot of the entire game, for every new comms session. |
| 6 | `LocationUpdate` | Regular location data from players. |
| 7 | `Player` | A player. |
| 8 | `Missile` | A missile. |
| 9 | `Interceptor` | An interceptor missile. |
| 10 | `MissileSite` | A missile launch site. |
| 11 | `SamSite` | A SAM site. |
| 12 | `OreMine` | An ore mine. |
| 13 | `SentryGun` | A sentry gun. |
| 14 | `Loot` | A loot cache. |
| 15 | `Radiation` | A radioactive area. |
| 16 | `AllianceMinor` | An alliance minor change (i.e. points change). |
| 17 | `AllianceMajor` | An alliance major change that should trigger a UI refresh (i.e. players joining/leaving, etc). |
| 18 | `Treaty` | A treaty. |
| 19 | `Avatar` | An avatar. |
| 21 | `Config` | The game configuration. |
| 23 | `Event` | An event message. |
| 24 | `Report` | A report message. |
| 25 | `BuildMissileSite` | A request to build a missile site. |
| 26 | `SellMissile` | A request to sell a missile. |
| 27 | `SellInterceptor` | A request to sell an interceptor. |
| 28 | `Ban` | Ban a player (as an administrator). |
| 29 | `FullPlayerStats` | A player's stats. |
| 30 | `LaunchMissile` | A request to launch a missile. |
| 31 | `LaunchPlayerMissile` | A request to launch a missile. |
| 32 | `LaunchInterceptor` | A request to launch an interceptor. |
| 33 | `LaunchPlayerInterceptor` | A request to launch an interceptor. |
| 34 | `AlertStatus` | A request for alert status. |
| 35 | `SAMSiteModeChange` | An instruction to change a SAM site mode. |
| 36 | `SAMSiteNameChange` | An instruction to change a SAM site name. |
| 37 | `MissileSiteNameChange` | An instruction to change a missile site name. |
| 38 | `SentryGunNameChange` | An instruction to change a sentry gun name. |
| 39 | `OreMineNameChange` | An instruction to change an ore mine name. |
| 40 | `CreateAlliance` | Alliance creation details. |
| 41 | `PurchaseMissiles` | A request to purchase missiles. |
| 42 | `PurchaseInterceptors` | A request to purchase interceptors. |
| 43 | `ProcessNames` | A list of process names, when location spoofing has been suspected. |
| 44 | `DeviceCheck` | Device check information. |
| 45 | `RenamePlayer` | A request for a player to change their name. |
| 46 | `RenameAlliance` | A request to change the name of an alliance. |
| 47 | `RedescribeAlliance` | A request to change an alliance description. |
| 48 | `MissileSitesOnOff` | An instruction to bring multiple missile sites online or take them offline. |
| 49 | `SAMSitesOnOff` | An instruction to bring multiple SAM sites online or take them offline. |
| 50 | `SentryGunsOnOff` | An instruction to bring multiple sentry guns online or take them offline. |
| 51 | `OreMinesOnOff` | An instruction to bring multiple ore mines online or take them offline. |
| 52 | `ImgAsset` | An image. |
### Command IDs

| ID | Name | Description |
|---|---|---|
| 0 | `AccountUnregistered` | The account must be registered (present user with form). |
| 1 | `MajorVersionInvalid` | Notify the client that a major update is available. |
| 2 | `NameTaken` | The player or alliance name already exists. |
| 3 | `AccountCreateSuccess` | The account was created successfully. |
| 6 | `SnapshotBegin` | Indicates the start of a requested game snapshot. |
| 7 | `SnapshotComplete` | Indicates the end of a requested game snapshot. |
| 8 | `SnapshotAck` | Acknowledges receipt of the end of the snapshot. |
| 9 | `ImageError` | Error reading image data. |
| 10 | `ActionSuccess` | The last action was completed. |
| 11 | `ActionFailed` | The last action failed for an unspecified reason. |
| 12 | `PurchaseMissileSystem` | A request to purchase a missile system for a player. |
| 13 | `PurchaseSAMSystem` | A request to purchase an air defence system for a player. |
| 14 | `BuildSamSite` | A request to build a SAM site. |
| 15 | `BuildSentryGun` | A request to build a sentry gun. |
| 16 | `BuildOreMine` | A request to build an ore mine. |
| 17 | `ReportAck` | A client acking a report so it may be deleted. |
| 18 | `KeepAlive` | A keepalive for when location information isn't available. |
| 19 | `RemovePlayer` | A player has left the game and must be removed. |
| 20 | `RemoveMissile` | A missile has been removed from the game. |
| 21 | `RemoveInterceptor` | An interceptor has been removed from the game. |
| 22 | `RemoveMissileSite` | A missile site has been removed from the game. |
| 23 | `RemoveSAMSite` | A SAM site has been removed from the game. |
| 24 | `RemoveOreMine` | An ore mine has been removed from the game. |
| 25 | `RemoveSentryGun` | A sentry gun has been removed from the game. |
| 26 | `RemoveLoot` | A loot has been removed from the game. |
| 27 | `RemoveRadiation` | A radioactive area has been removed from the game. |
| 28 | `RemoveAlliance` | An alliance has been removed from the game. |
| 29 | `RemoveTreaty` | A treaty has been removed from the game. |
| 30 | `Respawn` | A request to respawn. |
| 31 | `PlayerMissileSlotUpgrade` | A request to upgrade missile slots on player's CMS system. |
| 32 | `PlayerInterceptorSlotUpgrade` | A request to upgrade interceptor slots on player's SAM system. |
| 33 | `MissileSlotUpgrade` | A request to upgrade missile slots on a missile site (instance no). |
| 34 | `InterceptorSlotUpgrade` | A request to upgrade interceptor slots on a SAM site (instance no). |
| 35 | `PlayerMissileReloadUpgrade` | A request to upgrade reloading on player's CMS system. |
| 36 | `PlayerInterceptorReloadUpgrade` | A request to upgrade reloading on player's SAM system. |
| 37 | `MissileReloadUpgrade` | A request to upgrade reloading on a missile site (instance no). |
| 38 | `InterceptorReloadUpgrade` | A request to upgrade reloading on a SAM site (instance no). |
| 39 | `SellMissileSite` | A request to sell a missile site. |
| 40 | `SellSAMSite` | A request to sell a SAM site. |
| 41 | `SellSentryGun` | A request to sell a sentry gun. |
| 42 | `SellOreMine` | A request to sell an ore mine. |
| 43 | `SellMissileSystem` | A request to sell a missile system. |
| 44 | `SellSAMSystem` | A request to sell a SAM system. |
| 45 | `RepairMissileSite` | A request to remotely repair the missile site with instance number. |
| 46 | `RepairSAMSite` | A request to remotely repair the SAM site with instance number. |
| 47 | `RepairSentryGun` | A request to remotely repair the sentry gun with instance number. |
| 48 | `RepairOreMine` | A request to remotely repair the ore mine with instance number. |
| 49 | `Heal` | A request to fully heal the player. |
| 50 | `SetAvatar` | A request to set an avatar ID. |
| 51 | `CloseAccount` | A request to close the player's account. |
| 52 | `AlertAllClear` | Alert indication that a player is not under attack. |
| 53 | `AlertUnderAttack` | Alert indication that a player is under attack. |
| 54 | `AlertNukeEscalation` | Alert indication that a player's ally is under attack. |
| 55 | `AlertAllyUnderAttack` | Alert indication that a player's ally is under attack. |
| 58 | `UpgradeMissileSiteNuclear` | A request to upgrade a missile site to nuclear capabilities. |
| 59 | `JoinAlliance` | A request to join the specified alliance. |
| 60 | `LeaveAlliance` | A request to leave any alliance the player is a member of. |
| 61 | `DeclareWar` | A request for the player's alliance to declare war on the specified alliance. |
| 62 | `SetAllianceAvatar` | A request to set an alliance avatar ID. |
| 63 | `Promote` | A request to promote an alliance member to a leader. |
| 64 | `AcceptJoin` | Accept a player into the alliance you lead. |
| 65 | `RejectJoin` | Reject a player's request to join the alliance you lead. |
| 66 | `Kick` | Kick a player from the alliance you lead. |
| 67 | `ResetName` | Reset a player's name (as an administrator). |
| 68 | `ResetAvatar` | Reset a player's avatar (as an administrator). |
| 69 | `ProposeAffiliation` | An offer of a peace treaty to another alliance. |
| 70 | `AcceptAffiliation` | An acceptance of a peace treaty from another alliance. |
| 71 | `RejectAffiliation` | An acceptance of a peace treaty from another alliance. |
| 72 | `DisplayGeneralError` | A command to display a generic error on the client, for limited accounts suspected of cheating. |
