import { OnStart, Service } from "@flamework/core";
import { PlayerService } from "./Player.service";
import { MarketplaceService, Players } from "@rbxts/services";
import { EGamePasses } from "@common/shared/marketplace/EGamePasses";
import { ECurrencyMultipliers } from "@common/shared/data/currency-multipliers/ECurrencyMultipliers"
import { EDevProducts } from "@common/shared/marketplace/EDevProducts"
import Object from "@rbxts/object-utils"
import { CURRENCY_MULTIPLIERS_DATA } from "@common/shared/data/currency-multipliers/CurrencyMultipliers.data"
import { ProfilesService } from "./Profile.service"
import { CurrencyMultiplierUtils } from "@common/shared/utils/CurrencyMultiplier.utils"

@Service()
export class MarketService implements OnStart {
    
    private purchaseCallbacks: Record<number, (player: Player, receiptInfo: ReceiptInfo) => Enum.ProductPurchaseDecision> = {
        
    } 

    constructor(
        private readonly profilesService: ProfilesService,
        private readonly playerService: PlayerService,
    ) {}

    onStart(): void {
        MarketplaceService.ProcessReceipt = (receiptInfo) => this.processPurchase(receiptInfo);
        MarketplaceService.PromptGamePassPurchaseFinished.Connect((player, gamePassId, wasPurchased) => {
            if (!wasPurchased) return;
            this.playerService.addGamePass(player.User.Id, gamePassId as EGamePasses)
        })
    } 

    /* Award callbacks definitions */

    private buyNextCurrencyMultiplier(player: Player, newCurrencyMultiplierName: ECurrencyMultipliers, receiptInfo: ReceiptInfo): Enum.ProductPurchaseDecision {
        const playerSession = this.profilesService.getPlayerSession(player.User.Id);
        if (!playerSession) return this.validatePurchase(receiptInfo, false);
        
        const nextCurrencyMultiplier = CurrencyMultiplierUtils.getNextCurrencyMultiplierName(playerSession.currencyMultiplier);
        if (newCurrencyMultiplierName !== nextCurrencyMultiplier) return this.validatePurchase(receiptInfo, false);

        const success = this.profilesService.updateField(player.User.Id, ["currencyMultiplier"], () => newCurrencyMultiplierName);
        return this.validatePurchase(receiptInfo, success);
    }


    /* Utility */

    private validatePurchase(receiptInfo: ReceiptInfo, success: boolean): Enum.ProductPurchaseDecision {
        this.playerService.logPurchase(receiptInfo.PlayerId, receiptInfo.ProductId, receiptInfo.CurrencySpent, success);
        if (success) {
            return Enum.ProductPurchaseDecision.PurchaseGranted;
        } else {
            return Enum.ProductPurchaseDecision.NotProcessedYet;
        }
    }

    private processPurchase(receiptInfo: ReceiptInfo): Enum.ProductPurchaseDecision {
        try {
            const player = Players.GetPlayerByUserId(receiptInfo.PlayerId);
            if (!player) return this.validatePurchase(receiptInfo, false);

            const callback = this.purchaseCallbacks[receiptInfo.ProductId];
            if (callback) return callback(player, receiptInfo);

            for (const [multiplierName, multiplierDatum] of Object.entries(CURRENCY_MULTIPLIERS_DATA)) {
                if (multiplierDatum.productName === receiptInfo.ProductId) {
                    return this.buyNextCurrencyMultiplier(player, multiplierName, receiptInfo);
                }
            }

            warn(`The product with the id ${receiptInfo.ProductId} is not treated in the receipt processor.`);
			return this.validatePurchase(receiptInfo, false);
        } catch (e) {
            warn(`Error processing purchase for product ${receiptInfo.ProductId}: ${tostring(e)}`)
            return this.validatePurchase(receiptInfo, false);
        }
    }
}
